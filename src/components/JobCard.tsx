import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../models/Job';

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
          <p className="text-gray-600 mt-1">{job.company}</p>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Konum</p>
          <p className="text-gray-900">{job.location}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">İş Tipi</p>
          <p className="text-gray-900">{job.type}</p>
        </div>
      </div>

      {job.requirements && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">Gereksinimler</p>
          <p className="text-gray-900">{job.requirements}</p>
        </div>
      )}

      {job.salary && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">Maaş</p>
          <p className="text-gray-900">
            {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currency}
          </p>
        </div>
      )}

      <div className="mt-6">
        <Link
          to={`/jobs/${job.id}`}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Detayları Gör
        </Link>
      </div>
    </div>
  );
}; 