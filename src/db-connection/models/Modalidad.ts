import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "modalidad" })
export class Modalidad {
    @PrimaryColumn({ name: 'sModalidad' })
    public Modalidad: string;

    @Column('sDescripcion')
    public Descripcion: string;
}