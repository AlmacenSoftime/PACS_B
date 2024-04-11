import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm"
import { Rol } from "./Rol";

@Entity({ name: "usuario" })
export class Usuario {

    @PrimaryGeneratedColumn({ name: 'nUsuarioID' })
    id: number;

    @Column({ name: 'sUsuario' })
    usuario: string;

    @Column({ name: 'sNombreApellido' })
    nombreApellido: string;

    @Column({ name: 'sTelefonoNumero' })
    telefono: string;

    @Column({ name: 'sTelefonoPrefijo' })
    prefijo: string;

    @Column({ name: 'sEmail' })
    eMail: string;

    @Column({ name: 'sPassword' })
    password: string;

    @Column({ name: 'sConfigDashboardJson', nullable: true })
    config?: string;

    @Column({ name: 'sFotoPerfil', nullable: true })
    fotoPefil?: string;

    @Column({ name: 'sEstado' })
    estado: string;

    @ManyToMany(() => Rol, { eager: true, cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinTable({ name: 'usuariorol', joinColumn: { name: 'nUsuarioID' }, inverseJoinColumn: { name: 'nRolID' } })
    Roles: Rol[];

}