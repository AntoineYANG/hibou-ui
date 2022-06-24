/*
 * @Author: Kanata You 
 * @Date: 2022-06-13 16:36:56 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-06-13 19:13:40
 */

import React from 'react';
import styled from 'styled-components';


const ButtonElement = styled.div<{
  disabled?: boolean;
  danger?: boolean;
  running?: boolean;
}>(({ disabled, danger, running }) => ({}));

export interface ButtonProps {
  /**
   * The event to trigger when the button is clicked.
   * This method could be async.
   * The button will be disabled until the function returns a resolved value.
   */
  callback: () => (any | Promise<any>);
  /**
   * Whether the operation may cause massive effect, default to `false`.
   */
  danger?: boolean;
  /**
   * Whether the button is disabled, default to `false`.
   */
  disabled?: boolean;
  /**
   * Confirmation determine whether the operation should be triggered,
   * default to `false` (do not confirm).
   * 
   * If confirmation is required,
   * an object is supposed to be given.
   * 
   * optional `object.title` - title of the popover/dialog.
   * 
   * required `object.desc` - text to display.
   * 
   * required `object.type` - display mode.
   * valid values:
   * * `"popover"` - show a popover.
   * * `"dialog"` - open a dialog.
   */
  shouldConfirm?: false | {
    type: 'popover' | 'dialog';
  };
}

/**
 * An interactive item,
 * trigger an operation when clicked.
 * 
 * Once a `Button` is clicked,
 * it will be inactive until the triggered operation returns a resolved value.
 * 
 * Confirmation can be required to be invoked after a `Button` is clicked,
 * to show some warnings and decide whether the operation should be executed.
 */
const Button: React.FC<ButtonProps & { children: any }> = React.memo(function Button ({
  callback,
  danger = false,
  disabled = false,
  shouldConfirm = false,
  children
}) {
  const [active, setActive] = React.useState(true);

  const handler = React.useCallback(() => {
    if (disabled || !active) {
      return;
    }

    setActive(false);

    Promise.resolve(callback()).then(() => {
      setActive(true);
    });
  }, [callback, active, setActive, disabled]);

  return (
    <ButtonElement
      role="button"
      tabIndex={0}
      onClick={handler}
      danger={danger}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </ButtonElement>
  );
});


export default Button;
