"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Points, PointsData, FetchTypes } from "absinthe-task-sdk";
import { useRouter, useSearchParams } from "next/navigation";

export default function PointsPage() {
  const searchParams = useSearchParams();
  const apiKey = searchParams.get("apiKey");
  const projectId = searchParams.get("projectId");
  const points = new Points(apiKey!, projectId!);
  const pointsData = new PointsData(apiKey!, projectId!);
  const [hasFetched, setHasFetched] = useState(false);
  const [totalWalletPoints, setTotalWalletPoints] = useState(0);
  const [totalWalletEventPoints, setTotalWalletEventPoints] = useState(0);

  const [pointsActivity, setPointsActivity] = useState<FetchTypes.PointsData[]>(
    []
  );
  const [distributionAmounts, setDistributionAmounts] = useState({
    Wallet: "",
    Points: 0,
    Event: "",
  });
  const [walletAmounts, setWalletAmounts] = useState({
    Wallet: "",
  });
  const [walletEventAmounts, setWalletEventAmounts] = useState({
    Wallet: "",
    Event: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setDistributionAmounts((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  const handleWalletInputChange = (field: string, value: string) => {
    setWalletAmounts((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  const handleWalletEventInputChange = (field: string, value: string) => {
    setWalletEventAmounts((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleDistributeClick = async () => {
    try {
      const res = await points.distribute(distributionAmounts.Event, {
        points: distributionAmounts.Points,
        address: distributionAmounts.Wallet,
      });
      if (res.success) {
        toast.success(
          `Sent ${distributionAmounts.Points} points to ${distributionAmounts.Wallet}`
        );
        setDistributionAmounts({ Wallet: "", Points: 0, Event: "" });
        setHasFetched(false);
      } else {
        toast.error(res.error);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    }
  };
  const handleWalletClick = async () => {
    try {
      if (walletAmounts.Wallet !== "") {
        const res = await pointsData.fetchWalletActivityAndPoints(
          walletAmounts.Wallet
        );
        if (res.success) {
          setTotalWalletPoints(res.totalPoints!);
          toast.success(`Wallet points fetched successfully`);
        }
      } else {
        toast.error("Enter Wallet Address");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    }
  };
  const handleWalletEventClick = async () => {
    try {
      if (walletEventAmounts.Event !== "" && walletEventAmounts.Wallet !== "") {
        const res = await pointsData.fetchWalletActivityByEventAndPoints(
          walletEventAmounts.Event,
          walletEventAmounts.Wallet
        );
        if (res.success) {
          setTotalWalletEventPoints(res.totalPoints!);
          toast.success(
            `Wallet points for ${walletEventAmounts.Event} fetched successfully`
          );
        }
      } else {
        toast.error("Enter both Wallet and Event Name");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    }
  };

  useEffect(() => {
    const fetchPointsActivity = async () => {
      try {
        console.log(apiKey);
        console.log(projectId);
        const response = await pointsData.fetchActivity();
        if (response.success) {
          setPointsActivity(response.data!);
        } else {
          toast.error(response.error);
        }
      } catch (error: any) {
        console.error("Error fetching points activity:", error);
        toast.error(error?.response?.data?.error);
      } finally {
        setHasFetched(true);
      }
    };

    fetchPointsActivity();
  }, [projectId!, hasFetched]);
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-7xl w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Points Activity</h1>

        {!hasFetched && (
          <p className="text-xl text-gray-600 text-center mb-6">Loading...</p>
        )}

        {hasFetched && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-500">
              <thead>
                <tr className="bg-blue-200">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                    Wallet Address
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                    Points
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                    Event Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody>
                {pointsActivity.map((activity) => (
                  <tr key={activity.id} className="border-b border-gray-200">
                    <td className=" px-4 py-2 whitespace-nowrap">
                      {activity.wallet_address}
                    </td>
                    <td className="bg-blue-50 px-4 py-2 whitespace-nowrap">
                      {activity.points}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {activity.event_name}
                    </td>
                    <td className="bg-blue-50 px-4 py-2 whitespace-nowrap">
                      {new Date(activity.created_at!).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Distribute Points</h2>

          <div className="flex space-x-4">
            <input
              type="text"
              id="Wallet"
              value={distributionAmounts.Wallet}
              onChange={(e) => handleInputChange("Wallet", e.target.value)}
              placeholder="Wallet Address"
              className="w-1/4 px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <input
              type="number"
              id="Points"
              value={distributionAmounts.Points}
              onChange={(e) => handleInputChange("Points", e.target.value)}
              placeholder="Points"
              className="w-1/4 px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <input
              type="text"
              id="Event"
              value={distributionAmounts.Event}
              onChange={(e) => handleInputChange("Event", e.target.value)}
              placeholder="Event Name"
              className="w-1/4 px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={async () => {
                await handleDistributeClick();
              }}
            >
              Distribute
            </button>
          </div>
        </div>
        <div className="mt-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Wallet Points</h2>

          <div className="flex space-x-4">
            <input
              type="text"
              id="Wallet"
              value={walletAmounts.Wallet}
              onChange={(e) =>
                handleWalletInputChange("Wallet", e.target.value)
              }
              placeholder="Wallet Address"
              className="w-1/4 px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={async () => {
                await handleWalletClick();
              }}
            >
              Get Points
            </button>
            {totalWalletPoints !== 0 ? (
              <span className="font-mono text-3xl font-bold text-indigo-900">
                Points : {totalWalletPoints}
              </span>
            ) : (
              <span className="italic text-gray-400">No points</span>
            )}
          </div>
        </div>
        <div className="mt-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Wallet Points By Event</h2>

          <div className="flex space-x-4">
            <input
              type="text"
              id="Wallet"
              value={walletEventAmounts.Wallet}
              onChange={(e) =>
                handleWalletEventInputChange("Wallet", e.target.value)
              }
              placeholder="Wallet Address"
              className="w-1/4 px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <input
              type="text"
              id="Event"
              value={walletEventAmounts.Event}
              onChange={(e) =>
                handleWalletEventInputChange("Event", e.target.value)
              }
              placeholder="Event Name"
              className="w-1/4 px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={async () => {
                await handleWalletEventClick();
              }}
            >
              Get Points
            </button>
            {totalWalletEventPoints != 0 ? (
              <span className="font-mono text-3xl font-bold text-indigo-900">
                Points : {totalWalletEventPoints}
              </span>
            ) : (
              <span className="italic text-gray-400">No points</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
