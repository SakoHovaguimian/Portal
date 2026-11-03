import type { SVGProps } from 'react';
import type { IconName } from './iconName';

export type UiIconProps = SVGProps<SVGSVGElement> & { name: IconName };
