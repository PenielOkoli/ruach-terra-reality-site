"use client";

import { useMemo, useState } from "react";
import { fleet } from "@/content/site";
import { productionBasis } from "@/content/profile-details";
import { CoreSystemsTable } from "@/components/core-systems-table";
import { estimateHydraulicFill } from "@/lib/fleet/estimate";

const filters = [
  "All",
  "Dredgers",
  "Hopper fleet",
  "Pumping & pipeline",
  "Support fleet",
] as const;
export function FleetExplorer() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [volume, setVolume] = useState("25000");
  const [distance, setDistance] = useState("0.3");
  const [hours, setHours] = useState("12");
  const items =
    filter === "All" ? fleet : fleet.filter((item) => item.group === filter);
  const estimate = useMemo(
    () => estimateHydraulicFill({ volume, distance, hours }),
    [volume, distance, hours],
  );
  return (
    <>
      <div className="border-y border-line py-3">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {filters.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setFilter(item)}
              className={`border-b-2 pb-1 text-xs font-bold ${filter === item ? "border-rust text-rust" : "border-transparent text-clay hover:text-ink"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div
        className="table-scroll mt-8"
        tabIndex={0}
        role="region"
        aria-label="Fleet register"
      >
        <table className="document-table">
          <thead>
            <tr>
              <th>Group</th>
              <th>Equipment</th>
              <th>Available unit / role</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.name}>
                <td>{item.group}</td>
                <td className="font-semibold text-ink">{item.name}</td>
                <td>{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-14 grid gap-8 border-y-2 border-ink py-8 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <p className="section-label">Hydraulic fill estimator</p>
          <h2 className="mt-3 font-display text-3xl leading-none tracking-tight">
            Indicative production planning.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-clay">
            Planning basis: combined {productionBasis.low}–{productionBasis.high} m³/h ({productionBasis.systems}). Final output requires a source and pipeline test run.
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-clay">{productionBasis.shift}; {productionBasis.envelope}. Longer reaches require project-specific hydraulic modelling.</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <EstimatorField
              label="Volume required"
              unit="m³"
              value={volume}
              setValue={setVolume}
            />
            <EstimatorField
              label="Pipeline distance"
              unit="km"
              value={distance}
              setValue={setDistance}
            />
            <EstimatorField
              label="Shift hours"
              unit="hours"
              value={hours}
              setValue={setHours}
            />
          </div>
        </div>
        <div className="border-l-0 border-line pt-5 lg:border-l lg:pl-8 lg:pt-0">
          <p className="text-xs font-bold uppercase tracking-[.1em] text-clay">
            Indicative duration
          </p>
          {estimate.requiresAssessment ? <p className="mt-4 max-w-[28ch] text-base leading-7 text-navy" role="status">Site assessment required. This distance is outside the profile’s typical 140–400 m discharge envelope; no duration is predicted.</p> : <><p className="mt-4 font-display text-6xl leading-none tracking-tight text-navy">
            {estimate.low.toFixed(1)}–{estimate.high.toFixed(1)}
          </p>
          <p className="mt-2 text-sm text-clay">
            working days at the selected shift hours
          </p></>}
          <a href="/contact" className="btn btn-primary mt-7">
            Request a project quote
          </a>
        </div>
      </div>
      <div className="mt-14"><CoreSystemsTable /></div>
    </>
  );
}
function EstimatorField({
  label,
  unit,
  value,
  setValue,
}: {
  label: string;
  unit: string;
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <label className="block text-xs font-bold uppercase tracking-[.08em] text-clay">
      {label}
      <span className="mt-2 flex border-b border-ink">
        <input
          className="min-w-0 flex-1 bg-transparent py-2 text-lg font-bold text-ink outline-none"
          type="number"
          min="0"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <span className="self-center text-xs font-medium normal-case text-clay">
          {unit}
        </span>
      </span>
    </label>
  );
}
