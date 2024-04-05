import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm"
import { Permiso } from "./Permiso";

@Entity({ name: "rol" })
export class Rol {

    @PrimaryGeneratedColumn({ name: 'nRolID' })
    id: number;

    @Column({ name: 'sDenominacion' })
    Denominacion: string;

    @Column({ name: 'sEstado' })
    estado: string;

    @ManyToMany(() => Permiso, { eager: true })
    @JoinTable({ name: 'rolpermiso', joinColumn: { name: 'nRolID' }, inverseJoinColumn: { name: 'nPermisoID' } })
    Permisos: Permiso[];
}