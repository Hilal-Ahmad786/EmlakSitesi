'use client';

import { use, useState } from 'react';
import {
  Gift,
  Users,
  Trophy,
  Copy,
  Check,
  Share2,
  Mail,
  Phone,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReferralStats {
  referralCode: string;
  totalReferrals: number;
  pendingReferrals: number;
  successfulReferrals: number;
  totalRewards: number;
  currency: string;
}

const mockStats: ReferralStats = {
  referralCode: 'MAISON2024',
  totalReferrals: 5,
  pendingReferrals: 2,
  successfulReferrals: 3,
  totalRewards: 1500,
  currency: 'EUR',
};

const rewardTiers = [
  { referrals: 1, reward: 250, label: 'First Referral Bonus' },
  { referrals: 3, reward: 500, label: 'Silver Status' },
  { referrals: 5, reward: 750, label: 'Gold Status' },
  { referrals: 10, reward: 1500, label: 'Platinum Status' },
];

function StatCard({ icon: Icon, label, value, subtext }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon size={24} className="text-primary" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
      </div>
    </div>
  );
}

export default function ReferralPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const [stats] = useState(mockStats);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const referralLink = `https://maisondorient.com/?ref=${stats.referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(stats.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent("Join me at Maison d'Orient");
    const body = encodeURIComponent(
      `I've been exploring luxury properties with Maison d'Orient and thought you might be interested too!\n\nUse my referral code ${stats.referralCode} or click this link to get started:\n${referralLink}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out Maison d'Orient for luxury Istanbul properties! Use my referral code ${stats.referralCode}: ${referralLink}`
    );
    window.open(`https://wa.me/?text=${text}`);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setShowSuccess(true);
    setEmail('');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const currentTier = rewardTiers.reduce((acc, tier) => {
    return stats.successfulReferrals >= tier.referrals ? tier : acc;
  }, rewardTiers[0]);

  const nextTier = rewardTiers.find((tier) => tier.referrals > stats.successfulReferrals);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-white/70 mb-4">
              <Gift size={20} />
              <span>Referral Program</span>
            </div>
            <h1 className="text-4xl font-serif mb-4">Refer Friends, Earn Rewards</h1>
            <p className="text-lg text-white/80">
              Share the experience of luxury property hunting and earn rewards
              when your friends find their dream home.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <StatCard
              icon={Users}
              label="Total Referrals"
              value={stats.totalReferrals}
            />
            <StatCard
              icon={Trophy}
              label="Successful Referrals"
              value={stats.successfulReferrals}
            />
            <StatCard
              icon={Gift}
              label="Pending"
              value={stats.pendingReferrals}
              subtext="Awaiting completion"
            />
            <StatCard
              icon={Gift}
              label="Total Rewards"
              value={`€${stats.totalRewards}`}
              subtext="Earned to date"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Referral Code & Share */}
            <div className="lg:col-span-2 space-y-6">
              {/* Referral Code */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Your Referral Code</h2>
                <div className="flex items-center gap-3">
                  <div className="flex-1 px-4 py-3 bg-gray-100 rounded-lg font-mono text-lg text-primary">
                    {stats.referralCode}
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Share Options */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Share Your Link</h2>
                <div className="flex items-center gap-3 mb-6">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-100 rounded-lg text-sm text-gray-600"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleShareEmail}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Mail size={18} />
                    Email
                  </button>
                  <button
                    onClick={handleShareWhatsApp}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <Phone size={18} />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: "Join Maison d'Orient",
                          text: `Use my referral code ${stats.referralCode}`,
                          url: referralLink,
                        });
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>

              {/* Invite by Email */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Invite by Email</h2>
                <form onSubmit={handleInvite} className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="friend@example.com"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Send Invite
                  </button>
                </form>
                {showSuccess && (
                  <p className="text-green-600 text-sm mt-2">Invitation sent successfully!</p>
                )}
              </div>
            </div>

            {/* Reward Tiers */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Reward Tiers</h2>
                <div className="space-y-3">
                  {rewardTiers.map((tier) => {
                    const isAchieved = stats.successfulReferrals >= tier.referrals;
                    const isCurrent = tier === currentTier;

                    return (
                      <div
                        key={tier.referrals}
                        className={cn(
                          'flex items-center justify-between p-3 rounded-lg border-2 transition-colors',
                          isAchieved
                            ? 'border-green-500 bg-green-50'
                            : isCurrent
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200'
                        )}
                      >
                        <div>
                          <p className="font-medium text-gray-900">{tier.label}</p>
                          <p className="text-sm text-gray-500">
                            {tier.referrals} referral{tier.referrals > 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">€{tier.reward}</p>
                          {isAchieved && (
                            <span className="text-xs text-green-600">Achieved</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {nextTier && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-primary">
                        {nextTier.referrals - stats.successfulReferrals}
                      </span>{' '}
                      more referral{nextTier.referrals - stats.successfulReferrals > 1 ? 's' : ''} to reach{' '}
                      <span className="font-medium">{nextTier.label}</span>
                    </p>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${(stats.successfulReferrals / nextTier.referrals) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="bg-gray-100 rounded-xl p-6">
                <h3 className="font-medium text-gray-900 mb-2">Program Terms</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Rewards are credited after successful property purchase</li>
                  <li>• Referral must be a new customer</li>
                  <li>• Rewards can be redeemed as service credit</li>
                  <li>• Program terms subject to change</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
