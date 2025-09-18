# 智慧实验室系统技术实现细节

## 1. 智能排课算法详细实现

### 1.1 遗传算法实现

```typescript
// backend/src/algorithms/genetic/GeneticScheduler.ts
import { Course, Laboratory, Schedule, Constraint } from '../types';
import { Chromosome } from './Chromosome';
import { Population } from './Population';

export class GeneticScheduler {
    private populationSize: number = 100;
    private maxGenerations: number = 500;
    private mutationRate: number = 0.1;
    private crossoverRate: number = 0.8;
    
    constructor(
        private courses: Course[],
        private laboratories: Laboratory[],
        private constraints: Constraint[]
    ) {}

    async schedule(): Promise<Schedule[]> {
        // 初始化种群
        let population = this.initializePopulation();
        
        for (let generation = 0; generation < this.maxGenerations; generation++) {
            // 评估适应度
            this.evaluatePopulation(population);
            
            // 检查是否满足终止条件
            if (this.shouldTerminate(population, generation)) {
                break;
            }
            
            // 选择、交叉、变异
            population = this.evolvePopulation(population);
            
            // 每50代输出一次进度
            if (generation % 50 === 0) {
                console.log(`Generation ${generation}: Best fitness = ${population.getBestFitness()}`);
            }
        }
        
        return this.extractBestSchedule(population);
    }

    private initializePopulation(): Population {
        const chromosomes: Chromosome[] = [];
        
        for (let i = 0; i < this.populationSize; i++) {
            const chromosome = this.createRandomChromosome();
            chromosomes.push(chromosome);
        }
        
        return new Population(chromosomes);
    }

    private createRandomChromosome(): Chromosome {
        const genes: number[][] = [];
        
        // 为每个课程分配实验室和时间
        this.courses.forEach((course, courseIndex) => {
            const validSlots = this.findValidTimeSlots(course);
            const randomSlot = validSlots[Math.floor(Math.random() * validSlots.length)];
            
            genes.push([
                courseIndex,
                randomSlot.labIndex,
                randomSlot.timeSlot,
                randomSlot.weekDay,
                randomSlot.week
            ]);
        });
        
        return new Chromosome(genes);
    }

    private evaluatePopulation(population: Population): void {
        population.chromosomes.forEach(chromosome => {
            const fitness = this.calculateFitness(chromosome);
            chromosome.fitness = fitness;
        });
    }

    private calculateFitness(chromosome: Chromosome): number {
        let fitness = 0;
        const schedule = this.decodeChromosome(chromosome);
        
        // 1. 硬约束检查 (高惩罚)
        const hardConstraintViolations = this.checkHardConstraints(schedule);
        fitness -= hardConstraintViolations * 1000;
        
        // 2. 软约束检查 (低惩罚)
        const softConstraintViolations = this.checkSoftConstraints(schedule);
        fitness -= softConstraintViolations * 100;
        
        // 3. 资源利用率奖励
        const utilizationScore = this.calculateUtilizationScore(schedule);
        fitness += utilizationScore * 10;
        
        // 4. 时间分布均匀性奖励
        const distributionScore = this.calculateDistributionScore(schedule);
        fitness += distributionScore * 5;
        
        return fitness;
    }

    private checkHardConstraints(schedule: Schedule[]): number {
        let violations = 0;
        
        // 检查时间冲突
        violations += this.checkTimeConflicts(schedule);
        
        // 检查容量超限
        violations += this.checkCapacityOverflow(schedule);
        
        // 检查设备需求
        violations += this.checkEquipmentRequirements(schedule);
        
        return violations;
    }

    private checkTimeConflicts(schedule: Schedule[]): number {
        const timeLabMap = new Map<string, number>();
        let conflicts = 0;
        
        schedule.forEach(item => {
            const key = `${item.weekDay}-${item.timeSlot}-${item.labId}-${item.week}`;
            if (timeLabMap.has(key)) {
                conflicts++;
            } else {
                timeLabMap.set(key, item.courseId);
            }
        });
        
        return conflicts;
    }

    private checkCapacityOverflow(schedule: Schedule[]): number {
        let overflows = 0;
        
        schedule.forEach(item => {
            const lab = this.laboratories.find(l => l.id === item.labId);
            if (lab && item.studentCount > lab.capacity) {
                overflows++;
            }
        });
        
        return overflows;
    }

    private evolvePopulation(population: Population): Population {
        const newChromosomes: Chromosome[] = [];
        
        // 保留最优个体
        const bestChromosome = population.getBestChromosome();
        newChromosomes.push(bestChromosome.clone());
        
        // 生成新个体
        while (newChromosomes.length < this.populationSize) {
            const parent1 = this.tournamentSelection(population);
            const parent2 = this.tournamentSelection(population);
            
            let offspring: Chromosome;
            
            if (Math.random() < this.crossoverRate) {
                offspring = this.crossover(parent1, parent2);
            } else {
                offspring = parent1.clone();
            }
            
            if (Math.random() < this.mutationRate) {
                this.mutate(offspring);
            }
            
            newChromosomes.push(offspring);
        }
        
        return new Population(newChromosomes);
    }

    private tournamentSelection(population: Population): Chromosome {
        const tournamentSize = 3;
        const tournament: Chromosome[] = [];
        
        for (let i = 0; i < tournamentSize; i++) {
            const randomIndex = Math.floor(Math.random() * population.chromosomes.length);
            tournament.push(population.chromosomes[randomIndex]);
        }
        
        return tournament.reduce((best, current) => 
            current.fitness > best.fitness ? current : best
        );
    }

    private crossover(parent1: Chromosome, parent2: Chromosome): Chromosome {
        const crossoverPoint = Math.floor(Math.random() * parent1.genes.length);
        const newGenes = [...parent1.genes];
        
        for (let i = crossoverPoint; i < parent2.genes.length; i++) {
            newGenes[i] = [...parent2.genes[i]];
        }
        
        return new Chromosome(newGenes);
    }

    private mutate(chromosome: Chromosome): void {
        const geneIndex = Math.floor(Math.random() * chromosome.genes.length);
        const courseIndex = chromosome.genes[geneIndex][0];
        const course = this.courses[courseIndex];
        
        // 随机选择新的时间槽
        const validSlots = this.findValidTimeSlots(course);
        const randomSlot = validSlots[Math.floor(Math.random() * validSlots.length)];
        
        chromosome.genes[geneIndex] = [
            courseIndex,
            randomSlot.labIndex,
            randomSlot.timeSlot,
            randomSlot.weekDay,
            randomSlot.week
        ];
    }
}
```

### 1.2 约束处理系统

```typescript
// backend/src/services/ConstraintService.ts
import { Schedule, Constraint, ConstraintType } from '../types';

export class ConstraintService {
    private constraints: Map<ConstraintType, Constraint[]> = new Map();
    
    constructor(constraints: Constraint[]) {
        this.loadConstraints(constraints);
    }
    
    checkConstraints(schedule: Schedule[]): ConstraintViolation[] {
        const violations: ConstraintViolation[] = [];
        
        // 检查各类约束
        violations.push(...this.checkTimeConstraints(schedule));
        violations.push(...this.checkCapacityConstraints(schedule));
        violations.push(...this.checkEquipmentConstraints(schedule));
        violations.push(...this.checkTeacherConstraints(schedule));
        
        return violations;
    }
    
    private checkTimeConstraints(schedule: Schedule[]): ConstraintViolation[] {
        const violations: ConstraintViolation[] = [];
        const timeMap = new Map<string, Schedule[]>();
        
        // 按时间实验室分组
        schedule.forEach(item => {
            const key = `${item.weekDay}-${item.timeSlot}-${item.labId}`;
            if (!timeMap.has(key)) {
                timeMap.set(key, []);
            }
            timeMap.get(key)!.push(item);
        });
        
        // 检查时间冲突
        timeMap.forEach((items, key) => {
            if (items.length > 1) {
                violations.push({
                    type: ConstraintType.TIME_CONFLICT,
                    severity: 'high',
                    message: `时间冲突: ${key} 有 ${items.length} 个课程`,
                    affectedItems: items.map(item => item.id)
                });
            }
        });
        
        return violations;
    }
    
    private checkCapacityConstraints(schedule: Schedule[]): ConstraintViolation[] {
        const violations: ConstraintViolation[] = [];
        
        schedule.forEach(item => {
            if (item.studentCount > item.labCapacity) {
                violations.push({
                    type: ConstraintType.CAPACITY_MISMATCH,
                    severity: 'high',
                    message: `容量超限: ${item.courseName} 学生数(${item.studentCount})超过实验室容量(${item.labCapacity})`,
                    affectedItems: [item.id]
                });
            }
        });
        
        return violations;
    }
    
    private checkEquipmentConstraints(schedule: Schedule[]): ConstraintViolation[] {
        const violations: ConstraintViolation[] = [];
        
        schedule.forEach(item => {
            if (item.requiredEquipment && item.requiredEquipment.length > 0) {
                const missingEquipment = item.requiredEquipment.filter(eq => 
                    !item.availableEquipment.includes(eq)
                );
                
                if (missingEquipment.length > 0) {
                    violations.push({
                        type: ConstraintType.EQUIPMENT_REQUIREMENT,
                        severity: 'medium',
                        message: `设备缺失: ${item.courseName} 需要设备 ${missingEquipment.join(', ')}`,
                        affectedItems: [item.id]
                    });
                }
            }
        });
        
        return violations;
    }
    
    private checkTeacherConstraints(schedule: Schedule[]): ConstraintViolation[] {
        const violations: ConstraintViolation[] = [];
        const teacherSchedule = new Map<number, Schedule[]>();
        
        // 按教师分组
        schedule.forEach(item => {
            if (!teacherSchedule.has(item.teacherId)) {
                teacherSchedule.set(item.teacherId, []);
            }
            teacherSchedule.get(item.teacherId)!.push(item);
        });
        
        // 检查教师时间冲突
        teacherSchedule.forEach((items, teacherId) => {
            const timeConflicts = this.findTeacherTimeConflicts(items);
            if (timeConflicts.length > 0) {
                violations.push({
                    type: ConstraintType.TEACHER_PREFERENCE,
                    severity: 'high',
                    message: `教师时间冲突: 教师 ${teacherId} 在同一时间有多个课程`,
                    affectedItems: timeConflicts.map(item => item.id)
                });
            }
        });
        
        return violations;
    }
    
    private findTeacherTimeConflicts(items: Schedule[]): Schedule[] {
        const conflicts: Schedule[] = [];
        const timeMap = new Map<string, number>();
        
        items.forEach(item => {
            const key = `${item.weekDay}-${item.timeSlot}-${item.week}`;
            timeMap.set(key, (timeMap.get(key) || 0) + 1);
        });
        
        timeMap.forEach((count, key) => {
            if (count > 1) {
                conflicts.push(...items.filter(item => {
                    const itemKey = `${item.weekDay}-${item.timeSlot}-${item.week}`;
                    return itemKey === key;
                }));
            }
        });
        
        return conflicts;
    }
    
    private loadConstraints(constraints: Constraint[]): void {
        constraints.forEach(constraint => {
            if (!this.constraints.has(constraint.type)) {
                this.constraints.set(constraint.type, []);
            }
            this.constraints.get(constraint.type)!.push(constraint);
        });
    }
}
```

## 2. 实时通信实现

```typescript
// backend/src/services/NotificationService.ts
import { Server as SocketIOServer } from 'socket.io';
import { RedisClient } from '../utils/redis';

export class NotificationService {
    private io: SocketIOServer;
    private redis: RedisClient;
    
    constructor(io: SocketIOServer, redis: RedisClient) {
        this.io = io;
        this.redis = redis;
        this.setupSocketHandlers();
    }
    
    private setupSocketHandlers(): void {
        this.io.on('connection', (socket) => {
            console.log('User connected:', socket.id);
            
            // 加入用户房间
            socket.on('join', async (data) => {
                const { userId, role } = data;
                socket.join(`user_${userId}`);
                socket.join(`role_${role}`);
                
                // 存储用户连接信息
                await this.redis.setex(`socket:${userId}`, 3600, socket.id);
            });
            
            // 监听排课进度
            socket.on('scheduling_progress', (data) => {
                this.handleSchedulingProgress(data);
            });
            
            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
                this.handleDisconnection(socket);
            });
        });
    }
    
    async notifySchedulingProgress(scheduleId: string, progress: number, message: string): Promise<void> {
        const data = {
            scheduleId,
            progress,
            message,
            timestamp: new Date().toISOString()
        };
        
        // 广播给所有相关用户
        this.io.to('role_admin').emit('scheduling_progress', data);
        this.io.to('role_teacher').emit('scheduling_progress', data);
        
        // 存储进度信息
        await this.redis.setex(`scheduling:${scheduleId}:progress`, 300, JSON.stringify(data));
    }
    
    async notifyConflictDetected(conflict: any): Promise<void> {
        const notification = {
            type: 'conflict_detected',
            data: conflict,
            timestamp: new Date().toISOString(),
            priority: 'high'
        };
        
        // 通知管理员
        this.io.to('role_admin').emit('notification', notification);
        
        // 通知相关教师
        if (conflict.teacherId) {
            this.io.to(`user_${conflict.teacherId}`).emit('notification', notification);
        }
    }
    
    private async handleDisconnection(socket: any): Promise<void> {
        // 清理Redis中的连接信息
        const keys = await this.redis.keys(`socket:*`);
        for (const key of keys) {
            const socketId = await this.redis.get(key);
            if (socketId === socket.id) {
                await this.redis.del(key);
                break;
            }
        }
    }
    
    private handleSchedulingProgress(data: any): void {
        // 处理排课进度更新
        console.log('Scheduling progress:', data);
    }
}
```

## 3. 性能优化策略

### 3.1 本地化缓存架构设计（无Redis版本）

```typescript
// backend/src/services/OptimizationService.ts
import { Sequelize } from 'sequelize';
import { FileCacheManager } from '../utils/fileCache';

export class OptimizationService {
    private sequelize: Sequelize;
    private cache: FileCacheManager;
    
    constructor(sequelize: Sequelize) {
        this.sequelize = sequelize;
        this.cache = new FileCacheManager('./cache');
    }
    
    // 缓存优化（文件缓存替代Redis）
    async getScheduleWithCache(semester: string, week: number): Promise<any> {
        const cacheKey = `schedule:${semester}:${week}`;
        
        // 先检查文件缓存
        const cached = await this.cache.get(cacheKey);
        if (cached) {
            return cached;
        }
        
        // 查询数据库
        const schedule = await this.queryScheduleFromDB(semester, week);
        
        // 存入文件缓存，设置5分钟过期
        await this.cache.set(cacheKey, schedule, 300);
        
        return schedule;
    }
    
    // 批量查询优化
    async getCoursesBatch(courseIds: number[]): Promise<any[]> {
        const batchSize = 100;
        const results: any[] = [];
        
        for (let i = 0; i < courseIds.length; i += batchSize) {
            const batch = courseIds.slice(i, i + batchSize);
            const batchResults = await this.queryCoursesBatch(batch);
            results.push(...batchResults);
        }
        
        return results;
    }
    
    // 索引优化
    async optimizeDatabaseIndexes(): Promise<void> {
        const indexes = [
            'CREATE INDEX idx_schedule_composite ON course_schedules(laboratory_id, week_day, start_time, semester)',
            'CREATE INDEX idx_teacher_schedule ON course_schedules(teacher_id, week_day, start_time)',
            'CREATE INDEX idx_course_semester ON courses(semester, academic_year)',
            'CREATE INDEX idx_lab_status ON laboratories(status, capacity)'
        ];
        
        for (const index of indexes) {
            try {
                await this.sequelize.query(index);
            } catch (error) {
                console.log('Index may already exist:', index);
            }
        }
    }
    
    // 连接池优化
    optimizeConnectionPool(): void {
        this.sequelize.options.pool = {
            max: 20,
            min: 5,
            acquire: 30000,
            idle: 10000
        };
    }
    
    private async queryScheduleFromDB(semester: string, week: number): Promise<any> {
        return await this.sequelize.query(`
            SELECT 
                cs.*,
                c.course_name,
                c.course_code,
                c.student_count,
                l.name as lab_name,
                l.capacity as lab_capacity,
                u.username as teacher_name
            FROM course_schedules cs
            JOIN courses c ON cs.course_id = c.id
            JOIN laboratories l ON cs.laboratory_id = l.id
            JOIN users u ON cs.teacher_id = u.id
            WHERE cs.semester = :semester 
            AND cs.start_week <= :week 
            AND cs.end_week >= :week
            ORDER BY cs.week_day, cs.start_time
        `, {
            replacements: { semester, week },
            type: QueryTypes.SELECT
        });
    }
    
    private async queryCoursesBatch(courseIds: number[]): Promise<any[]> {
        return await this.sequelize.query(`
            SELECT * FROM courses WHERE id IN (:courseIds)
        `, {
            replacements: { courseIds },
            type: QueryTypes.SELECT
        });
    }
}
```

### 3.2 前端性能优化

```typescript
// frontend/src/utils/performance.ts
import { debounce, throttle } from 'lodash';

// 虚拟滚动实现
export class VirtualScroll {
    private container: HTMLElement;
    private itemHeight: number;
    private totalItems: number;
    private visibleItems: number;
    private startIndex: number = 0;
    
    constructor(container: HTMLElement, itemHeight: number, totalItems: number) {
        this.container = container;
        this.itemHeight = itemHeight;
        this.totalItems = totalItems;
        this.visibleItems = Math.ceil(container.clientHeight / itemHeight);
        
        this.setupScrollListener();
    }
    
    private setupScrollListener(): void {
        const handleScroll = throttle(() => {
            const scrollTop = this.container.scrollTop;
            const newStartIndex = Math.floor(scrollTop / this.itemHeight);
            
            if (newStartIndex !== this.startIndex) {
                this.startIndex = newStartIndex;
                this.renderVisibleItems();
            }
        }, 16); // 60fps
        
        this.container.addEventListener('scroll', handleScroll);
    }
    
    private renderVisibleItems(): void {
        const endIndex = Math.min(
            this.startIndex + this.visibleItems + 2, // 多渲染2个作为缓冲
            this.totalItems
        );
        
        // 触发重新渲染
        this.updateRenderRange(this.startIndex, endIndex);
    }
    
    private updateRenderRange(start: number, end: number): void {
        // 通知React组件更新渲染范围
        const event = new CustomEvent('renderRangeUpdate', { 
            detail: { start, end } 
        });
        document.dispatchEvent(event);
    }
}

// 图片懒加载
export class LazyImageLoader {
    private images: NodeListOf<HTMLImageElement>;
    private imageObserver: IntersectionObserver;
    
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.setupIntersectionObserver();
    }
    
    private setupIntersectionObserver(): void {
        this.imageObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target as HTMLImageElement);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '50px 0px', // 提前50px开始加载
                threshold: 0.01
            }
        );
        
        this.images.forEach(img => {
            this.imageObserver.observe(img);
        });
    }
    
    private loadImage(img: HTMLImageElement): void {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.onload = () => {
                img.classList.add('loaded');
                delete img.dataset.src;
            };
        }
    }
}

// API请求缓存
export class ApiCache {
    private cache: Map<string, { data: any, timestamp: number }> = new Map();
    private defaultTTL: number = 5 * 60 * 1000; // 5分钟
    
    async get<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
        const cached = this.cache.get(key);
        const now = Date.now();
        
        if (cached && (now - cached.timestamp) < (ttl || this.defaultTTL)) {
            return cached.data;
        }
        
        const data = await fetcher();
        this.cache.set(key, { data, timestamp: now });
        
        return data;
    }
    
    clear(key?: string): void {
        if (key) {
            this.cache.delete(key);
        } else {
            this.cache.clear();
        }
    }
}
```

## 4. 监控和日志系统

```typescript
// backend/src/utils/logger.ts
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export class Logger {
    private logger: winston.Logger;
    
    constructor() {
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json()
            ),
            defaultMeta: { service: 'smart-lab-system' },
            transports: [
                // 错误日志
                new DailyRotateFile({
                    filename: 'logs/error-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    level: 'error',
                    maxSize: '20m',
                    maxFiles: '14d'
                }),
                
                // 应用日志
                new DailyRotateFile({
                    filename: 'logs/app-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxSize: '20m',
                    maxFiles: '30d'
                }),
                
                // 控制台输出
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                })
            ]
        });
    }
    
    info(message: string, meta?: any): void {
        this.logger.info(message, meta);
    }
    
    error(message: string, error?: Error, meta?: any): void {
        this.logger.error(message, { error, ...meta });
    }
    
    warn(message: string, meta?: any): void {
        this.logger.warn(message, meta);
    }
    
    debug(message: string, meta?: any): void {
        this.logger.debug(message, meta);
    }
}

// 性能监控
export class PerformanceMonitor {
    private metrics: Map<string, number[]> = new Map();
    
    startTimer(name: string): () => void {
        const start = process.hrtime.bigint();
        
        return () => {
            const end = process.hrtime.bigint();
            const duration = Number(end - start) / 1e6; // 转换为毫秒
            
            this.recordMetric(name, duration);
        };
    }
    
    recordMetric(name: string, value: number): void {
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }
        
        this.metrics.get(name)!.push(value);
        
        // 只保留最近100个数据点
        if (this.metrics.get(name)!.length > 100) {
            this.metrics.get(name)!.shift();
        }
    }
    
    getStats(name: string): MetricStats | null {
        const values = this.metrics.get(name);
        if (!values || values.length === 0) {
            return null;
        }
        
        const sorted = [...values].sort((a, b) => a - b);
        const count = values.length;
        const sum = values.reduce((a, b) => a + b, 0);
        
        return {
            count,
            avg: sum / count,
            min: sorted[0],
            max: sorted[count - 1],
            p50: sorted[Math.floor(count * 0.5)],
            p95: sorted[Math.floor(count * 0.95)],
            p99: sorted[Math.floor(count * 0.99)]
        };
    }
}
```

这些技术实现细节涵盖了智能排课系统的核心算法、实时通信、性能优化和监控等关键方面，为系统的稳定运行提供了坚实的技术保障。