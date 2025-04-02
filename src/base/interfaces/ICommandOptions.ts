
export default interface ICommandOptions {
    name: string;
    description: string;
    options: object;
    dm_permissions: boolean;
    default_member_permissions: BigInt;
    cooldown: number;
}