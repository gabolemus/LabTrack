import React from "react";
import { HistoryEntry } from "../../organisms/EquipmentList/equipment";
import { timestampToDate } from "../../../utils/utils";
import "./EquipmentHistoryTable.scss";

/** Props for EquipmentHistoryTable component */
export interface EquipmentHistoryTableProps {
  /** History items of the equipment */
  historyItems: HistoryEntry[];
  /** Whether to show the user column or not */
  showUser?: boolean;
}

const EquipmentHistoryTable = ({
  historyItems,
  showUser,
}: EquipmentHistoryTableProps) => {
  return (
    <div id="equipment-history-table-container">
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Descripción</th>
            <th scope="col">Fecha</th>
            {showUser && <th scope="col">Usuario</th>}
            {showUser && <th scope="col">Correo</th>}
          </tr>
        </thead>
        <tbody>
          {historyItems.map((historyItem, index) => (
            <tr key={index}>
              <td className="history-item-desc">
                {historyItem.description.split("<br>").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </td>
              <td className="history-item-timestamp">
                {timestampToDate(historyItem.timestamp.toString())}
              </td>
              {showUser && (
                <td className="history-item-username">
                  {historyItem.user.name}
                </td>
              )}
              {showUser && (
                <td className="history-item-useremail">
                  <a href={`mailto:${historyItem.user.email}`}>
                    {historyItem.user.email}
                  </a>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentHistoryTable;
