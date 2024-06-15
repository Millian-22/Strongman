'use client';

import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { api } from '~/trpc/react';
import { convertStringtoDate } from '~/app/_components/createLog';
import { nanoid } from 'nanoid';
import { type CellValueChangedEvent } from 'ag-grid-community';

type RepsAndWeight = {
  reps: number; 
  weight: number;
}

type RowData = {
  id: string; 
  date: Date;
  exercise: string;
  repsAndWeight: RepsAndWeight[];
}

export const LiftingLog = () => {
  const todaysDate = new Date();
  // const createWorkoutLog = api.workoutLog.createWorkoutLog.useMutation({});
  const createLiftingLog = api.liftingLog.createWorkout.useMutation({});
  const updateLiftingLog = api.liftingLog.updateWorkout.useMutation({});
  const {data: liftingLogData, isLoading, isError} = api.liftingLog.getAll.useQuery();
  
  const [rowData, setRowData] = useState<RowData[]>(!isError && liftingLogData ? liftingLogData.map((log) => ({
      ...log,
      date: log.date,
      exercise: log.exercise,
      repsAndWeight: [{reps: log.reps, weight: log.weight}],
      id: log.workoutLogId as string, 
  })): []);

  


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

  if (isLoading) {
    return <div>Is Loading</div> 
  } else 
  if (isError) {
    return <div>There Has Been An Error Loading This Page</div>
  }

  const addNewRow = async () => {
    const rowId = nanoid();
    const newEmptyRow = { id: rowId, date: convertStringtoDate(todaysDate), exercise: '', reps: 0, weight: 0};
    const newRow = await createLiftingLog.mutateAsync({
      ...newEmptyRow,
    });
    setRowData([...rowData, {...newRow, id: newRow.workoutLogId as string, date: todaysDate, repsAndWeight: [{reps: newRow.reps, weight: newRow.weight}] }]);
  };

  const onCellValueChange = async (params: CellValueChangedEvent<RowData>) => {
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
    }
  }


  return (
    <div style={{ width: '100%', height: '100%' }}>
      <button onClick={addNewRow} style={{ marginBottom: '10px' }}>
        Add New Row
      </button>
      {liftingLogData ? <div className="ag-theme-alpine" style={{ height: 800, width: 600 }}>
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
      </div> : null}
    </div>
  );
};
