import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "./base.entity";
import { EPin } from "./epin.entity";
import { User } from "./user.entity";

@Entity()
export class EpinHistory extends Base {
    @ManyToOne(() => User, user => user.epinHistory, { onDelete: 'CASCADE' })
    @JoinColumn()
    owner: User;

    @ManyToOne(() => EPin, epin => epin.history, { onDelete: 'CASCADE' })
    @JoinColumn()
    epin: EPin;

    @Column('text')
    remark: string;
}