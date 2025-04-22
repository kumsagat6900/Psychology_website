import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitTestDto } from './dto/submit-test.dto';
import { TestType } from '@prisma/client';
import { subDays } from 'date-fns';

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}

  // Получение своих тестов
  async getTestsByUserId(userId: string) {
    return this.prisma.testResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Получение одного теста
  async getTestById(id: string, user: any) {
    const test = await this.prisma.testResult.findUnique({
      where: { id },
    });

    if (!test) {
      throw new NotFoundException('Тест не найден');
    }

    if (user.role === 'STUDENT' && test.userId !== user.sub) {
      throw new ForbiddenException('Нет доступа к этому тесту');
    }

    return test;
  }

  // Отправка теста с автоанализом
  async submitTest(userId: string, dto: SubmitTestDto) {
    if (dto.type === TestType.PHILLIPS) {
      const result = this.analyzePhillips(dto.answers);

      return this.prisma.testResult.create({
        data: {
          userId,
          type: dto.type,
          answers: dto.answers,
          score: result.score,
          category: result.category,
        },
      });
    }

    if (dto.type === TestType.OLWEUS) {
      const result = this.analyzeOlweus(dto.answers);

      return this.prisma.testResult.create({
        data: {
          userId,
          type: dto.type,
          answers: dto.answers,
          score: result.score,
          category: result.category,
        },
      });
    }

    throw new Error('Этот тип теста пока не поддерживается.');
  }

  // Анализ Филлипса
  private analyzePhillips(answers: string[]): {
    score: number;
    category: string;
  } {
    const keysYes = [11, 20, 22, 24, 25, 30, 35, 36, 38, 39, 41, 43, 44];
    const keysNo = Array.from({ length: 58 }, (_, i) => i + 1).filter(
      (n) => !keysYes.includes(n),
    );

    let total = 0;

    keysYes.forEach((n) => {
      if (answers[n - 1]?.toLowerCase() === 'да') total += 1;
    });

    keysNo.forEach((n) => {
      if (answers[n - 1]?.toLowerCase() === 'нет') total += 1;
    });

    const percent = (total / 58) * 100;

    let category = 'норма';
    if (percent > 75) category = 'высокая тревожность';
    else if (percent > 50) category = 'умеренная тревожность';

    return {
      score: parseFloat(percent.toFixed(2)),
      category,
    };
  }

  // Анализ Олвеуса
  private analyzeOlweus(answers: number[]): {
    score: number;
    category: string;
  } {
    const scale = {
      directBullying: [1, 3, 5, 6],
      indirectBullying: [2, 4],
      directVictim: [7, 10, 11, 13],
      indirectVictim: [8, 9, 12],
    };

    const average = (indices: number[]) =>
      parseFloat(
        (
          indices.reduce((sum, i) => sum + (answers[i - 1] || 0), 0) /
          indices.length
        ).toFixed(2),
      );

    const result = {
      directBullying: average(scale.directBullying),
      indirectBullying: average(scale.indirectBullying),
      directVictim: average(scale.directVictim),
      indirectVictim: average(scale.indirectVictim),
    };

    const allScores = Object.values(result);
    const maxScore = Math.max(...allScores);

    let category = 'слабо выражен';
    if (maxScore >= 3) category = 'ярко выражен';
    else if (maxScore >= 1) category = 'умеренно выражен';

    return {
      score: maxScore,
      category,
    };
  }
  async getAllTests(params: {
    type?: string;
    category?: string;
    userId?: string;
    sort?: 'asc' | 'desc';
  }) {
    const { type, category, userId, sort } = params;

    return this.prisma.testResult.findMany({
      where: {
        ...(type ? { type: type as TestType } : {}),
        ...(category ? { category } : {}),
        ...(userId ? { userId } : {}),
      },
      orderBy: {
        createdAt: sort || 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }
  async getSummaryStats() {
    const tests = await this.prisma.testResult.findMany();

    const total = tests.length;
    const highAnxiety = tests.filter(
      (t) => t.type === TestType.PHILLIPS && t.category?.includes('высокая'),
    ).length;

    const bullying = tests.filter(
      (t) => t.type === TestType.OLWEUS && t.category !== 'слабо выражен',
    ).length;

    const uniqueStudents = new Set(tests.map((t) => t.userId)).size;

    return {
      totalTests: total,
      highAnxiety,
      bullyingCases: bullying,
      uniqueStudents,
    };
  }
  async getStats(range: string = 'all') {
    const where: any = {};

    if (range === '7d') {
      where.createdAt = { gte: subDays(new Date(), 7) };
    } else if (range === '30d') {
      where.createdAt = { gte: subDays(new Date(), 30) };
    }

    const results = await this.prisma.testResult.findMany({
      where,
      select: { type: true, category: true },
    });

    const stats = {};
    for (const { type, category } of results) {
      if (!stats[type]) stats[type] = {};
      if (!stats[type][category]) stats[type][category] = 0;
      stats[type][category]++;
    }

    return stats;
  }
  async getTestsByStudentId(studentId: string) {
    return this.prisma.testResult.findMany({
      where: {
        userId: studentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }
}
