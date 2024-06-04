import { Column, Entity } from "typeorm";

@Entity({ name: "parametrosistema" })
export class ParametrosSistema {
    @Column({ name: 'sSigsOperativo' })
    public SigsOperativo: number;

    @Column({ name: 'PortalOperativo' })
    public PortalOperativo: number;

    @Column({ name: 'CarpetaPDF' })
    public CarpetaPDF?: string;

    @Column({ name: 'ColorPrincipalInterfaz' })
    public ColorPrimarioInterfaz: string;
}
