import { Expose } from "class-transformer";
import moment = require("moment");
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
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

    @Expose()
    get days() {
        const aDate = moment([this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate()]);
        const bDate = moment([this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate()]);
        return aDate.diff(bDate, 'days');
    }

    public static findByOwner(ownerId: string) {
        return this.createQueryBuilder('rapid')
            .leftJoin('rapid.owner', 'owner')
            .where("owner.id = :ownerId", {ownerId})
            .getOne()
            .then(b => b ?? null);
    }

    public static findIncomplete() {
        return this.find({ where: { status: 'incomplete' }, relations: ["owner"] });
    }

    public static async updateToNext(ids: string[], endDate: Date) {
        const result = await this.update(ids, {
            amount: 2500,
            target: 30,
            endDate
        });
        if (result.affected && result.affected === 0) {
            throw Error("No changed made to the challenge. Entity might be missing. Check " + ids);
        }
        return this.findByIds(ids);
    }

    public static async completeChallenges(ids: string[]) {
        const result = await this.update(ids, { status: 'complete' });
        if (result.affected && result.affected === 0) {
            throw Error("No changed made to the challenge. Entity might be missing. Check " + ids);
        }
        return this.findByIds(ids);
    }
}