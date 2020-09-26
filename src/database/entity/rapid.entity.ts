import { Column, Entity, EntityManager, In, JoinColumn, ManyToOne, UpdateResult } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";

@Entity()
export class Rapid extends Base {
    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column({ default: 1000 })
    amount: number;

    @Column({ default: 10 })
    target: number;

    @Column({ default: 'incomplete' })
    status: 'incomplete' | 'complete';

    @ManyToOne(() => User, user => user.challenges, { onDelete: 'CASCADE' })
    @JoinColumn()
    owner: User;

    public static findByOwner(ownerId: string) {
        return this.createQueryBuilder('rapid')
            .leftJoinAndSelect('rapid.owner', 'owner')
            .where("owner.id = :ownerId", { ownerId })
            .orderBy("rapid.createdAt", "DESC")
            .getOne()
            .then(b => b ?? null);
    }

    public static findIncomplete() {
        return this.find({ where: { status: 'incomplete' }, relations: ["owner"] });
    }

    public static async updateToNext(ids: string[], endDate: Date, trx?: EntityManager) {
        let result: UpdateResult;
        const options: Partial<Rapid> = { amount: 2500, target: 30, endDate }

        if (trx) {
            result = await trx.update(this, { id: In(ids) }, options);
        } else {
            result = await this.update(ids, options);
        }

        if (result.affected && result.affected === 0) {
            throw Error("No changed made to the challenge. Entity might be missing. Check " + ids);
        }
        return this.findByIds(ids, { relations: ['owner'] });
    }

    public static async completeChallenges(ids: string[], trx?: EntityManager) {
        let result: UpdateResult;
        if (trx) {
            result = await trx.update(Rapid, { id: In(ids) }, { status: 'complete' });
        } else {
            result = await this.update(ids, { status: 'complete' });
        }
        if (result.affected && result.affected === 0) {
            throw Error("No changed made to the challenge. Entity might be missing. Check " + ids);
        }
        return this.findByIds(ids, { relations: ['owner'] });
    }
}