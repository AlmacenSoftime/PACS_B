import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "permiso" })
export class Permiso {

    @PrimaryGeneratedColumn({ name: 'nPermisoID' })
    id: number;

    @Column({ name: 'sDenominacion' })
    Denominacion: string;

    @Column({ name: 'sPermisoCodigo' })
    PermisoCodigo: string;

    @Column({ name: 'sEstado' })
    estado: string;
}