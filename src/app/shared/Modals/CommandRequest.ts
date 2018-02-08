// export interface IPosts {
//     userId: number;
//     id: number;
//     title: string;
//     body: string;
// }

export class CommandRequest {
     InstanceId: string;
     Handler: string;
     Value: string ;
     MaxAttempts: number
}