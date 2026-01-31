import React from 'react';
import { ControlProps } from '../../types.ts';
interface TimeDisplayProps extends ControlProps {
    showDuration?: boolean;
    separator?: string;
}
export declare const TimeDisplay: React.FC<TimeDisplayProps>;
export {};
