/*
 * @Author: Kanata You 
 * @Date: 2022-06-24 19:29:44 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-06-24 21:56:22
 */

export interface ColorSet {
  background: string;
  shadow: string;
  border: string;
  iconColor: string;
}

const colors: ColorSet = {
  background: '#fcfcfc',
  shadow: '#4e4e4e',
  border: '#b2b2b2',
  iconColor: '#999999',
};


export default colors as Readonly<ColorSet>;
