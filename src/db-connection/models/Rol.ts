import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm"
import { Permiso } from "./Permiso";

@Entity({ name: "rol" })
export class Rol {

    @PrimaryGeneratedColumn({ name: 'nRolID' })
    public id: number;

    @Column({ name: 'sDenominacion' })
    public Denominacion: string;

    @Column({ name: 'sEstado' })
    public Estado: string;

    @ManyToMany(() => Permiso, { eager: true })
    @JoinTable({ name: 'rolpermiso', joinColumn: { name: 'nRolID' }, inverseJoinColumn: { name: 'nPermisoID' } })
    public Permisos: Permiso[];
}