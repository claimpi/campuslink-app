import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderTrackingId = searchParams.get('OrderTrackingId');
  const merchantReference = searchParams.get('OrderMerchantReference');

  if (!orderTrackingId || !merchantReference) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const supabase = createClient();

  // Find transaction
  const { data: tx } = await supabase
    .from('transactions')
    .select('*')
    .eq('pesapal_order_id', merchantReference)
    .single();

  if (!tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });

  // Update status
  await supabase.from('transactions')
    .update({ status: 'completed', pesapal_tracking_id: orderTrackingId })
    .eq('id', tx.id);

  // Credit coins
  if (tx.coins_amount > 0) {
    await supabase.from('profiles')
      .update({ coin_balance: supabase.rpc('increment', { x: tx.coins_amount }) })
      .eq('id', tx.user_id);
  }

  // Activate subscription if it's a subscription payment
  if (tx.transaction_type === 'subscription') {
    const metadata = tx.metadata || {};
    await supabase.from('subscriptions')
      .update({ is_active: true, pesapal_subscription_id: orderTrackingId })
      .eq('user_id', tx.user_id)
      .eq('is_active', false)
      .order('created_at', { ascending: false })
      .limit(1);

    await supabase.from('profiles')
      .update({ subscription_tier: metadata.tier, subscription_expires_at: metadata.expires_at })
      .eq('id', tx.user_id);
  }

  // Notify user
  await supabase.from('notifications').insert({
    user_id: tx.user_id,
    type: tx.transaction_type === 'subscription' ? 'subscription' : 'coin_purchase',
    title: tx.transaction_type === 'subscription' ? '🌟 Subscription Active!' : '🪙 Coins Added!',
    body: tx.transaction_type === 'subscription'
      ? 'Your premium subscription is now active. Enjoy!'
      : `${tx.coins_amount} Campus Coins have been added to your account.`,
    data: { transaction_id: tx.id },
  });

  return NextResponse.json({ status: 'success' });
}
