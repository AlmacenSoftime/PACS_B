export const SERIES_ORTHANC_MAPPING_INFO: { [key: string]: { name: string, mappedName?: string, type: 'String' | 'Date' | 'Time' } } = {
    '0008,0070': { name: 'Manufacturer', type: 'String', mappedName: 'Fabricante'},
    '0008,1090': { name: 'ManufacturerModelName', type: 'String', mappedName: 'Modelo Equipo' },
    '0008,0054': { name: 'RetrieveAETitle', type: 'String', mappedName: 'Nombre Equipo' },
    '0008,0060': { name: 'Modality', type: 'String', mappedName: 'Modalidad' },
}