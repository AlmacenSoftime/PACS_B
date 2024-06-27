import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Usuario } from "./Usuario";

@Entity({ name: "estudioinforme" })
export class EstudioInforme {
    @PrimaryGeneratedColumn({ name: 'nEstudioInformeID' })
    public id: number;

    @Column({ name: 'sEstudioID' })
    public EstudioId: string;

    @Column({ name: 'nUsuarioID' })
    public Usuario: number;

    @Column({ name: 'sPreInforme' })
    public Preinforme: string;

    @Column({ name: 'sEstadoID' })
    public Estado: string;

    @Column({ name: 'dCierreFechaHora' })
    public FechaCierre: Date;

    @Column({ name: 'nCierreUsuario' })
    public UsuarioCierreID?: number;

    @Column({ name: 'sAudAccion', default: '' })
    public AudAccion: string;

    @Column({ name: 'dAudFechaHora', default: '' })
    public AudFechaHora: Date;

    @Column({ name: 'sMedicoFirmante' })
    public MedicoInformante?: string;

    @OneToOne(() => Usuario, { eager: true })
    @JoinColumn({ name: 'nUsuarioID' })
    public UsuarioCierre?: Usuario;
}