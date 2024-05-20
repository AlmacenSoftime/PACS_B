import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "estudioinforme" })
export class EstudioInforme {
    @PrimaryGeneratedColumn({ name: 'nEstudioInformeID' })
    id: number;

    @Column({ name: 'sEstudioID' })
    EstudioId: string;

    @Column({ name: 'sPreInforme' })
    Preinforme: string;

    @Column({ name: 'sEstado' })
    Estado: string;

}