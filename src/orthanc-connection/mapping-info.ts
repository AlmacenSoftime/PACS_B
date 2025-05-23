

export const ORTHANC_MAPPING_INFO: { [key: string]: { name: string, mappedName?: string, type: 'String' | 'Date' | 'Time' } } = {
    '0008,0005': { name: 'SpecificCharacterSet', type: 'String', mappedName: '' },
    '0008,0008': { name: 'ImageType', type: 'String', },
    '0008,0016': { name: 'SOPClassUID', type: 'String', },
    '0008,0018': { name: 'SOPInstanceUID', type: 'String', },
    '0008,0020': { name: 'StudyDate', type: 'Date', mappedName: 'Fec Estudio' },
    '0008,0021': { name: 'SeriesDate', type: 'String', },
    '0008,0022': { name: 'AcquisitionDate', type: 'String', },
    '0008,0023': { name: 'ContentDate', type: 'String', },
    '0008,0030': { name: 'StudyTime', type: 'Time', mappedName: 'Hs Estudio' },
    '0008,0031': { name: 'SeriesTime', type: 'String', },
    '0008,0032': { name: 'AcquisitionTime', type: 'String', },
    '0008,0033': { name: 'ContentTime', type: 'String', },
    '0008,0050': { name: 'AccessionNumber', mappedName: 'Número Turno', type: 'String', },
    '0008,0080': { name: 'InstitutionName', type: 'String', },
    '0008,0090': { name: 'ReferringPhysicianName', mappedName: 'Médico Prescribe', type: 'String', },
    '0008,1010': { name: 'StationName', type: 'String', },
    '0008,1030': { name: 'StudyDescription', mappedName: 'Nombre Estudio', type: 'String', },
    '0008,103e': { name: 'SeriesDescription', type: 'String', },
    '0008,1140': { name: 'ReferencedImageSequence', type: 'String', },
    '0008,2112': { name: 'SourceImageSequence', type: 'String', },
    '0009,0010': { name: 'PrivateCreator', type: 'String', },
    '0010,0010': { name: 'PatientName', mappedName: 'Nombre Paciente', type: 'String', },
    '0010,0020': { name: 'PatientID', mappedName: 'ID Paciente', type: 'String', },
    '0010,0030': { name: 'PatientBirthDate', mappedName: 'Fec Nac', type: 'Date', },
    '0010,0040': { name: 'PatientSex', mappedName: 'Sexo', type: 'String', },
    '0010,1010': { name: 'PatientAge', type: 'String', },
    '0010,1030': { name: 'PatientWeight', type: 'String', },
    '0012,0050': { name: 'ClinicalTrialTimePointID', type: 'String', },
    '0012,0051': { name: 'ClinicalTrialTimePointDescription', type: 'String', },
    '0012,0062': { name: 'PatientIdentityRemoved', type: 'String', },
    '0012,0063': { name: 'DeidentificationMethod', type: 'String', },
    '0012,0064': { name: 'DeidentificationMethodCodeSequence', type: 'String', },
    '0013,0010': { name: 'PrivateCreator', type: 'String', },
    //'0013,1010': { name: '(Unknown Tag & Data)' },
    //'0013,1013': { name: '(Unknown Tag & Data)' },
    '0018,0015': { name: 'BodyPartExamined', type: 'String', },
    '0018,0050': { name: 'SliceThickness', type: 'String', },
    '0018,0060': { name: 'KVP', type: 'String', },
    '0018,0090': { name: 'DataCollectionDiameter', type: 'String', },
    '0018,1000': { name: 'DeviceSerialNumber', type: 'String', },
    '0018,1012': { name: 'DateOfSecondaryCapture', type: 'String', },
    '0018,1020': { name: 'SoftwareVersions', type: 'String', },
    '0018,1030': { name: 'ProtocolName', type: 'String', },
    '0018,1100': { name: 'ReconstructionDiameter', type: 'String', },
    '0018,1110': { name: 'DistanceSourceToDetector', type: 'String', },
    '0018,1111': { name: 'DistanceSourceToPatient', type: 'String', },
    '0018,1120': { name: 'GantryDetectorTilt', type: 'String', },
    '0018,1130': { name: 'TableHeight', type: 'String', },
    '0018,1140': { name: 'RotationDirection', type: 'String', },
    '0018,1150': { name: 'ExposureTime', type: 'String', },
    '0018,1151': { name: 'XRayTubeCurrent', type: 'String', },
    '0018,1152': { name: 'Exposure', type: 'String', },
    '0018,1160': { name: 'FilterType', type: 'String', },
    '0018,1170': { name: 'GeneratorPower', type: 'String', },
    '0018,1190': { name: 'FocalSpots', type: 'String', },
    '0018,1200': { name: 'DateOfLastCalibration', type: 'String', },
    '0018,1201': { name: 'TimeOfLastCalibration', type: 'String', },
    '0018,1210': { name: 'ConvolutionKernel', type: 'String', },
    '0018,5100': { name: 'PatientPosition', type: 'String', },
    '0019,0010': { name: 'PrivateCreator', type: 'String', },
    '0019,10b0': { name: 'FeedPerRotation', type: 'String', },
    '0020,000d': { name: 'StudyInstanceUID', mappedName: 'UID Estudio', type: 'String', },
    '0020,000e': { name: 'SeriesInstanceUID', type: 'String', },
    '0020,0010': { name: 'StudyID', mappedName: 'ID Estudio', type: 'String', },
    '0020,0011': { name: 'SeriesNumber', type: 'String', },
    '0020,0012': { name: 'AcquisitionNumber', type: 'String', },
    '0020,0013': { name: 'InstanceNumber', type: 'String', },
    '0020,0032': { name: 'ImagePositionPatient', type: 'String', },
    '0020,0037': { name: 'ImageOrientationPatient', type: 'String', },
    '0020,0052': { name: 'FrameOfReferenceUID', type: 'String', },
    '0020,1040': { name: 'SliceLocation', type: 'String', },
    '0020,1041': { name: 'PositionReferenceIndicator', type: 'String', },
    '0021,0010': { name: 'PrivateCreator', type: 'String', },
    '0021,1011': { name: 'Target', type: 'String', },
    '0028,0002': { name: 'SamplesPerPixel', type: 'String', },
    '0028,0004': { name: 'PhotometricInterpretation', type: 'String', },
    '0028,0010': { name: 'Rows', type: 'String', },
    '0028,0011': { name: 'Columns', type: 'String', },
    '0028,0030': { name: 'PixelSpacing', type: 'String', },
    '0028,0100': { name: 'BitsAllocated', type: 'String', },
    '0028,0101': { name: 'BitsStored', type: 'String', },
    '0028,0102': { name: 'HighBit', type: 'String', },
    '0028,0103': { name: 'PixelRepresentation', type: 'String', },
    '0028,0303': { name: 'LongitudinalTemporalInformationModified', type: 'String', },
    '0028,1050': { name: 'WindowCenter', type: 'String', },
    '0028,1051': { name: 'WindowWidth', type: 'String', },
    '0028,1052': { name: 'RescaleIntercept', type: 'String', },
    '0028,1053': { name: 'RescaleSlope', type: 'String', },
    '0028,1055': { name: 'WindowCenterWidthExplanation', type: 'String', },
    '0029,0010': { name: 'PrivateCreator', type: 'String', },
    '0029,0011': { name: 'PrivateCreator', type: 'String', },
    '7fe0,0010': { name: 'PixelData', type: 'String', },
}
