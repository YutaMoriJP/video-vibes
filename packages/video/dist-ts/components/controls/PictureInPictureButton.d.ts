import React from 'react';
import { ControlProps } from '../../types.ts';
interface PiPButtonProps extends ControlProps {
    videoRef: React.RefObject<HTMLVideoElement>;
}
export declare const PictureInPictureButton: React.FC<PiPButtonProps>;
export {};
