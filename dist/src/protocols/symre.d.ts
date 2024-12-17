import { HandlerProps } from '../../types/common';
export declare const SYMRE: {
    name: string;
    address: string;
    opReturnSchema: {
        url: string;
    }[];
    handler: ({ dataObj, cell, tx }: HandlerProps) => void;
};
