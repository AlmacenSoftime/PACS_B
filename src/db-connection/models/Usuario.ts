import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm"
import { Rol } from "./Rol";

@Entity({ name: "usuario" })
export class Usuario {

    @PrimaryGeneratedColumn({ name: 'nUsuarioID' })
    public id: number;

    @Column({ name: 'sUsuario' })
    public usuario: string;

    @Column({ name: 'sNombreApellido' })
    public nombreApellido: string;

    @Column({ name: 'sTelefonoNumero' })
    public telefono: string;

    @Column({ name: 'sTelefonoPrefijo' })
    public prefijo: string;

    @Column({ name: 'sEmail' })
    public eMail: string;

    @Column({ name: 'sPassword' })
    public password: string;

    @Column({ name: 'sConfigDashboardJson', nullable: true })
    public config?: string;

    @Column({ name: 'sFotoPerfil', nullable: true })
    public fotoPefil?: string;

    @Column({ name: 'sEstado' })
    public estado: string;

    @ManyToMany(() => Rol, { eager: true, cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinTable({ name: 'usuariorol', joinColumn: { name: 'nUsuarioID' }, inverseJoinColumn: { name: 'nRolID' } })
    public Roles: Rol[];

}