
import React from 'react';
import { 
  Copy, Link as LinkIcon, Ticket, Download, 
  ExternalLink, Zap, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, InfoTooltip } from './Common';
import { MeasurementPack } from '../types';
import { useI18n } from '../contexts/I18nContext';

interface MeasurementPackCardProps {
  pack: MeasurementPack;
  className?: string;
}

export const MeasurementPackCard: React.FC<MeasurementPackCardProps> = ({ pack, className }) => {
  const { t } = useI18n();
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(t('common.copied'));
  };

  return (
    <Card className={`border-l-4 border-l-indigo-500 overflow-hidden ${className}`}>
      <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-500/20 rounded-md text-indigo-600 dark:text-indigo-400">
              <Zap size={18} />
            </div>
            <CardTitle>{t('measurement.title')}</CardTitle>
          </div>
          <Badge variant="brand">{t('measurement.auto_generated')}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {/* PLACEMENT WARNING - REINFORCING NO-TOUCH */}
        <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-500/20 rounded-lg flex items-start gap-2">
            <AlertTriangle size={16} className="text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-200">
               {t('tooltips.mandatory')}
            </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                <LinkIcon size={14} /> {t('measurement.tracked_link')}
                <InfoTooltip content={t('tooltips.tracking')} />
              </label>
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-600 dark:text-slate-300 truncate">
                  {pack.trackingUrl}
                </div>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => handleCopy(pack.trackingUrl)}
                  icon={<Copy size={14} />}
                >
                  {t('common.copy')}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                <Ticket size={14} /> {t('measurement.coupon_code')}
              </label>
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xl font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider text-center">
                  {pack.couponCode}
                </div>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => handleCopy(pack.couponCode)}
                  icon={<Copy size={14} />}
                >
                  {t('common.copy')}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 shrink-0">
            <div className="mb-3 bg-white p-2 rounded-lg">
                <img 
                    src={pack.qrCodeUrl} 
                    alt="QR Code" 
                    className="w-32 h-32 object-contain mix-blend-multiply" 
                />
            </div>
            <Button 
                size="sm" 
                variant="outline" 
                className="w-full text-xs"
                icon={<Download size={14} />}
            >
                {t('measurement.download_qr')}
            </Button>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <ExternalLink size={12} />
            <span>{t('measurement.footer_info')}</span>
        </div>
      </CardContent>
    </Card>
  );
};
