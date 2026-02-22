import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

export function TalentPool() {
  const { talentPool } = useApp();
  const [skillFilter, setSkillFilter] = useState('');
  const [minExperience, setMinExperience] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('name', { header: 'Name', cell: (info) => info.getValue() }),
    columnHelper.accessor('skills', {
      header: 'Skills',
      cell: (info) => (Array.isArray(info.getValue()) ? info.getValue().join(', ') : info.getValue()),
    }),
    columnHelper.accessor('experience', { header: 'Experience (yrs)', cell: (info) => info.getValue() }),
    columnHelper.accessor('location', { header: 'Location', cell: (info) => info.getValue() }),
    columnHelper.accessor('contact', { header: 'Contact', cell: (info) => info.getValue() }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: () => (
        <Button size="sm" variant="secondary">
          Add to Campaign
        </Button>
      ),
    }),
  ];

  const filteredCandidates = talentPool.filter((c) => {
    const skills = Array.isArray(c.skills) ? c.skills : [];
    const skillMatch = skillFilter
      ? skills.some((s) =>
          s.toLowerCase().includes(skillFilter.toLowerCase().trim())
        )
      : true;
    const experienceMatch =
      minExperience !== ''
        ? (c.experience ?? 0) >= Number(minExperience)
        : true;
    const locationMatch = locationFilter
      ? String(c.location || '')
          .toLowerCase()
          .includes(locationFilter.toLowerCase().trim())
      : true;
    return skillMatch && experienceMatch && locationMatch;
  });

  const table = useReactTable({
    data: filteredCandidates,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Talent Pool</h1>
        <p className="text-gray-600 mt-1">Filter and add candidates to campaigns</p>
      </div>

      <Card>
        <h2 className="font-semibold text-gray-800 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skillset</label>
            <input
              type="text"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              placeholder="e.g. React, Python"
              className="w-full rounded-lg border border-pastel-blue/50 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min years of experience</label>
            <input
              type="number"
              min={0}
              value={minExperience}
              onChange={(e) => setMinExperience(e.target.value)}
              placeholder="e.g. 2"
              className="w-full rounded-lg border border-pastel-blue/50 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="e.g. Remote, Berlin"
              className="w-full rounded-lg border border-pastel-blue/50 px-3 py-2"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Results below update based on skillset, minimum experience, and location.
        </p>
      </Card>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-pastel-blue/20 border-b border-pastel-blue/30">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="px-4 py-3 text-sm font-semibold text-gray-800"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                    No candidates match filters.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-pastel-blue/20 hover:bg-pastel-blue/5"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm text-gray-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
