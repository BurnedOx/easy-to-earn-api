import { Expose } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Base } from "./base.entity";
import { EPin } from "./epin.entity";
import { User } from "./user.entity";

@Entity()
export class UserEpin extends Base {
    @ManyToOne(() => User, user => user.parchasedEpins, { onDelete: 'CASCADE' })
    @JoinColumn()
    owner: User;

    @OneToOne(() => EPin, epin => epin.prachsedBy, { onDelete: 'CASCADE' })
    @JoinColumn()
    epin: EPin;

    @Expose()
    @Column('text')
    get status() {
        return this.epin.owner ? 'used' : 'unused';
    }
}