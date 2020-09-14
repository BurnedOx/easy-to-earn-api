import { Expose } from "class-transformer";
import moment = require("moment");
import { Column, Entity } from "typeorm";
import { Base } from "./base.entity";

@Entity()
export class Rapid extends Base {
    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column()
    amount: number;

    @Column({ default: 'incomplete' })
    status: 'incomplete' | 'complete';

    @Expose()
    get days() {
        const aDate = moment([this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate()]);
        const bDate = moment([this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate()]);
        return aDate.diff(bDate, 'days');
    }
}