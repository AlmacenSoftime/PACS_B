export interface StudyModel {
    ID: string
    IsStable: boolean
    Labels: string[]
    LastUpdate: string
    MainDicomTags: OrthancTags
    ParentPatient: string
    PatientMainDicomTags: OrthancTags
    Series: string[]
    Type: string
}

declare type OrthancTags = { [key: string]: { Name: string, Type: string, Value: string } };
