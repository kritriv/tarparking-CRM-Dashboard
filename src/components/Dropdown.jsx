import { Dropdown, Button } from "antd";

const DropdownComponent = ({
  items,
  placement,
  arrow,
  trigger,
  icon,
  button,
  buttonText,
}) => {
  return (
    <Dropdown
      menu={{
        items,
      }}
      placement={placement || "bottomLeft"}
      arrow={arrow && arrow}
      trigger={trigger && ["click"]}
    >
      <a onClick={(e) => e.preventDefault()}>
        {icon && icon}
        {button && buttonText && <Button>{buttonText}</Button>}
      </a>
    </Dropdown>
  );
};

export default DropdownComponent;
