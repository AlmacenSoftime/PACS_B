import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "estudioinforme" })
export class EstudioInforme {
    @PrimaryGeneratedColumn({ name: 'nEstudioInformeID' })
    public id: number;

    @Column({ name: 'sEstudioID' })
    public EstudioId: string;

    @Column({ name: 'sUsuario' })
    public Usuario: string;

    @Column({ name: 'sPreInforme' })
    public Preinforme: string;

    @Column({ name: 'dCierreFechaHora' })
    public FechaCierre: Date;

    @Column({ name: 'sCierreUsuario' })
    public UsuarioCierre: string;

    @Column({ name: 'sAudAccion', default: '' })
    public AudAccion: string;

    @Column({ name: 'dAudFechaHora', default: '' })
    public AudFechaHora: Date;

}