import React, { useRef } from "react";
import { formatMoney } from "../../scripts/utils/currency";

interface MoneyProps {
  amount: number;
  withCurrency?: boolean;
}

const Money: React.FunctionComponent<MoneyProps> = ({
  amount,
  withCurrency,
}: MoneyProps) => {
  const money = (amount: MoneyProps["amount"]) =>
    formatMoney(
      amount,
      window["theme"][withCurrency ? "moneyWithCurrencyFormat" : "moneyFormat"],
    );
  const moneyEl = useRef(null);
  return <span ref={moneyEl}>{money(amount)}</span>;
};

export default Money;
