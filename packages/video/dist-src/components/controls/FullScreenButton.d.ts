import React from 'react';
import { ControlProps } from '../../types';
interface FullScreenButtonProps extends ControlProps {
    targetRef: React.RefObject<HTMLElement>;
}
export declare const FullScreenButton: React.FC<FullScreenButtonProps>;
export {};
