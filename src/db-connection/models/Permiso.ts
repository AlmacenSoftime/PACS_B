import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "permiso" })
export class Permiso {

    @PrimaryGeneratedColumn({ name: 'nPermisoID' })
    public id: number;

    @Column({ name: 'sDenominacion' })
    public Denominacion: string;

    @Column({ name: 'sPermisoCodigo' })
    public PermisoCodigo: string;

    @Column({ name: 'sEstado' })
    public Estado: string;

    @Column({ name: 'dCierreFechaHora' })
    public FechaCierre: Date;

    @Column({ name: 'sCierreUsuario' })
    public UsuarioCierre: string;
}