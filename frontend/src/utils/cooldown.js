// PDF 4.4: ছেলেদের ৩ মাস, মেয়েদের ৪ মাস অপেক্ষা
export function nextEligibleDate(lastDonation, gender) {
  const d = new Date(lastDonation);
  d.setMonth(d.getMonth() + (gender === "female" ? 4 : 3));
  return d;
}

export function isInCooldown(lastDonation, gender) {
  return new Date() < nextEligibleDate(lastDonation, gender);
}

export function formatDate(date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}