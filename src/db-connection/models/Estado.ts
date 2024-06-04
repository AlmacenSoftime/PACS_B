import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "estado" })
export class Estado {
    @PrimaryColumn({ name: 'sEstadoID' })
    public Estado: string;

    @Column('sDescripcion')
    public Descripcion: string;
}