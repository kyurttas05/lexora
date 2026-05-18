-- Onboarding tamamlanma flag'i
alter table public.user_profiles
  add column if not exists onboarding_completed boolean default false;

-- Mevcut kullan?c?lar onboarded say?ls?n (hesaplari coktan var)
update public.user_profiles set onboarding_completed = true where onboarding_completed = false;
