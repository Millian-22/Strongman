'use client';

import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { api } from '~/trpc/react';
import { convertStringtoDate } from '~/app/_components/createLog';
import { nanoid } from 'nanoid';

type RepsAndWeight = {
  reps: number; 
  weight: number;
}

type RowData = {
  id?: string; 
  date: Date;
  exercise: string;
  repsAndWeight: RepsAndWeight[];
}

// const updateCellValue = () => {
//   const updatedRowData = rowData.map((row, index) =>
//     index === params.node.rowIndex ? { ...row, [params.colDef.field]: params.newValue } : row
//   );
//   return updatedRowData;
// }

export const LiftingLog = () => {
  const todaysDate = new Date();
  
  const [rowData, setRowData] = useState<RowData[]>([
    { date: todaysDate, exercise: '', repsAndWeight: [{reps: 0, weight: 0}] },
  ]);
  const createWorkoutLog = api.workoutLog.createWorkoutLog.useMutation({});
  const createLiftingLog = api.liftingLog.createWorkout.useMutation({});
  const updateLiftingLog = api.liftingLog.updateWorkout.useMutation({});
  const seeMany = api.liftingLog.getAll.useQuery();


  const [columnDefs] = useState([
    { headerName: 'Date', field: 'date', editable: true, cellDataType: 'date' },
    { headerName: 'Exercise', field: 'exercise', editable: true },
    { headerName: 'Reps & Weight', 
      children: [
        {columnGroupShow: 'open', headerName: 'Reps', field: 'reps', editable: true, type: 'numericColumn' },
        {columnGroupShow: 'open', headerName: 'Weight', field: 'weight', editable: true, type: 'numericColumn' },
      ],
    }
  ]);

  const addNewRow = () => {
    setRowData([...rowData, { date: todaysDate, exercise: '', repsAndWeight: [{reps: 0, weight: 0}]}]);
  };

  // const addRepsAndWeightColumn = (rowIndex: number) => {
  //   const updatedRowData = rowData.map((row, index) =>
  //     index === rowIndex ? { ...row, repsAndWeight: [...row.repsAndWeight, {reps: 0, weight: 0}] } : row
  //   );
  //   setRowData(updatedRowData);
  // };

  const onCellValueChange = async (params: any) => {
    const updatedRowData = rowData.map((row, index) =>
      index === params.node.rowIndex ? { ...row, [params.colDef.field]: params.newValue } : row
    );

    setRowData(updatedRowData);

    console.log('params', params);

    const updatedRow = {
      id: params.data.id,
      date: convertStringtoDate(params.data.date),
      exercise: params.data.exercise,
      reps: Number(params.data.reps),
      weight: params.data.weight ? Number(params.data.weight): 0,
    };

    console.log('id', updatedRow.id);

    console.log('updatedRow', updatedRow);
    if(updatedRow.id) {
      console.log('getting here');
      updateLiftingLog.mutate(updatedRow);
    } else {
      const rowId = nanoid();
      console.log('here then');
      // const workoutLog = await createWorkoutLog.mutateAsync({ date: updatedRow.date});
      // console.log('workoutLog', workoutLog);
      const newRow = await createLiftingLog.mutateAsync({
        ...updatedRow, id: rowId,
      });
      setRowData(
        rowData.map((row, index) =>
          index === params.node.rowIndex ? { ...row, id: newRow.workoutLogId } : row
        )
      );
    }

    // updateLiftingGrid.mutate(updatedRow);
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <button onClick={addNewRow} style={{ marginBottom: '10px' }}>
        Add New Row
      </button>
      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            editable: true,
            flex: 1,
            resizable: true,
          }}
          onCellValueChanged={onCellValueChange}
        />
      </div>
      <div>{JSON.stringify(seeMany)}</div>
    </div>
  );
};
