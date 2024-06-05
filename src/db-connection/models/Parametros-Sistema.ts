import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "parametrosistema" })
export class ParametrosSistema {

    @PrimaryGeneratedColumn({ name: 'ParametroSistemaID' })
    public id: number;

    @Column({ name: 'sSigsOperativo' })
    public SigsOperativo: number;

    @Column({ name: 'PortalOperativo' })
    public PortalOperativo: number;

    @Column({ name: 'CarpetaPDF' })
    public CarpetaPDF?: string;

    @Column({ name: 'ColorPrincipalInterfaz' })
    public ColorPrimarioInterfaz: string;
}
