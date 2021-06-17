import {FieldModel, FilterCellRendererProps, FilterValueConverter, ItemModel}
  from '@vlsergey/react-bootstrap-pagetable';
import React, {useCallback} from 'react';
import Form from 'react-bootstrap/Form';

export interface ExampleItemType {
  id: string;
  name: string;
  birthday: string;
}

const FilterCell = ({filterBy, onFilterByChange}: FilterCellRendererProps<ExampleItemType, string, string>) =>
  <td>
    <Form.Control
      onChange={useCallback(
        ({currentTarget: {value}}: React.ChangeEvent<HTMLInputElement>) => onFilterByChange(value)
        , [ onFilterByChange ])}
      placeholder="value to filter by (show values that contains entered text)"
      type="text"
      value={filterBy || ''} />
  </td>;

const filterValueConverter: FilterValueConverter<string> = {
  fromString: (str: string) => str,
  toString: (str: string) => str,
};

export const ExampleItemModel: ItemModel<ExampleItemType> = {
  idF: ({id}: ExampleItemType) => id,
  fields: [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      filterValueConverter,
      renderFilterCell: FilterCell
    } as FieldModel<ExampleItemType, string>,
    {
      key: 'birthday',
      title: 'Birth Date',
      render: ({value}: {value: string}) => new Date(Date.parse(value)).toLocaleDateString(),
      sortable: true,
    },
    {
      key: 'birthyear',
      title: 'Birth Year',
      getter: ({birthday}: ExampleItemType) => new Date(Date.parse(birthday)).getFullYear(),
      sortable: true,
    },
  ]
};

export const ExampleData: ExampleItemType[] = [
  {id: '1', name: 'Alice', birthday: '2001-02-03'},
  {id: '2', name: 'Bob', birthday: '2002-03-04'},
  {id: '3', name: 'Carl', birthday: '2003-04-05'},
  {id: '4', name: 'David', birthday: '2004-05-06'},
  {id: '5', name: 'Eva', birthday: '2005-06-07'},
  {id: '6', name: 'Fiona', birthday: '2006-07-08'},
  {id: '7', name: 'Helen', birthday: '2007-08-09'}
];