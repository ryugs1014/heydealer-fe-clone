'use client';

import React, { useState } from 'react';
import s from './DetailModal.module.scss';
import ModalClose from '/public/svg/modal-close.svg';
import ModalBack from '/public/svg/modal-back.svg';
import ModalInfo from '/public/svg/modal-info.svg';
import ButtonCheck from '/public/svg/button-check.svg';

interface DetailModalProps {
  isMounted: boolean;
  animState: 'right' | 'visible' | 'down';
  onClose: () => void;
  isFromPechaModal?: boolean;
  onBack?: () => void;
}

export default function DetailModal({
  isMounted,
  animState,
  onClose,
  isFromPechaModal,
  onBack,
}: DetailModalProps) {
  const [driveType, setDriveType] = useState<string | null>(null);
  const [shiftType, setShiftType] = useState<string | null>(null);
  const [phone, setPhone] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
    let formattedPhone = '';
    if (onlyNums.length <= 3) formattedPhone = onlyNums;
    else if (onlyNums.length <= 7)
      formattedPhone = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    else
      formattedPhone = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
    setPhone(formattedPhone);
  };

  // 언마운트 상태일 때 렌더링 방지
  if (!isMounted) return null;

  return (
    // <div
    //   className={`${s['modal-overlay']}
    //   `}
    //   onClick={onClose}
    // >
    //   <div
    //     className={`${s['close-modal-bg']} ${animState === 'visible' ? s['fade-in'] : s['fade-out']}
    //           `}
    //     onClick={onClose}
    //   ></div>

    <div
      className={`${s['modal-content']} ${
        animState === 'right'
          ? s['slide-right']
          : animState === 'down'
            ? s['slide-down']
            : s['visible']
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={s['modal-header']}>
        <div className={s['button-section']}>
          {isFromPechaModal ? (
            <button className={s['back-btn']} onClick={onBack}>
              <div className={s['svg-box']}>
                <ModalBack width="100%" height="100%" viewBox="0 0 24 24" />
              </div>
            </button>
          ) : (
            <button className={s['close-btn']} onClick={onClose}>
              <div className={s['svg-box']}>
                <ModalClose width="100%" height="100%" viewBox="0 0 24 24" />
              </div>
            </button>
          )}
        </div>
      </div>

      <div className={s['detail-content']}>
        <div className={`${s['pecha-section']}`}>
          <h2>
            카톡으로
            <br />
            폐차견적을 보내드릴게요.
          </h2>

          <div className={s['input-section']}>
            <div className={`${s['input-wrap']} ${s['radio-input-wrap']}`}>
              <label className={s['info-label']}>
                🚙 운행이 가능한가요?
                <div className={s['info-button-wrap']}>
                  <div className={s['info-svg-box']}>
                    <ModalInfo width="100%" height="100%" viewBox="0 0 24 24" />
                  </div>
                  <div className={`${s['tooltip']} ${s['value-tooltip']}`}>
                    <p className={s['tooltip-text']}>
                      운행이 불가능한 경우, 배터리 방전 상태 기준으로 견적을
                      드려요.
                      <br />
                      (엔진ㆍ 미션 고장 상태라면, 견적이 조정될 수 있어요.)
                    </p>
                  </div>
                </div>
              </label>
              <div className={s['radio-group']}>
                <label
                  className={`${s['radio-label']} ${driveType === '네' ? s['checked'] : ''}`}
                >
                  <input
                    type="radio"
                    value="네"
                    checked={driveType === '네'}
                    onChange={(e) => setDriveType(e.target.value)}
                    className={s['hidden-radio']}
                  />
                  <span className={s['custom-radio']}></span>
                  <span className={s['radio-text']}>네, 가능해요.</span>
                </label>
                <label
                  className={`${s['radio-label']} ${driveType === '아니요' ? s['checked'] : ''}`}
                >
                  <input
                    type="radio"
                    value="아니요"
                    checked={driveType === '아니요'}
                    onChange={(e) => setDriveType(e.target.value)}
                    className={s['hidden-radio']}
                  />
                  <span className={s['custom-radio']}></span>
                  <span className={s['radio-text']}>아니요, 불가능해요.</span>
                </label>
              </div>
            </div>

            <div className={`${s['input-wrap']} ${s['radio-input-wrap']}`}>
              <label>⚙️ 변속기 정보를 알려주세요.</label>
              <div className={s['radio-group']}>
                <label
                  className={`${s['radio-label']} ${shiftType === '오토' ? s['checked'] : ''}`}
                >
                  <input
                    type="radio"
                    value="오토"
                    checked={shiftType === '오토'}
                    onChange={(e) => setShiftType(e.target.value)}
                    className={s['hidden-radio']}
                  />
                  <span className={s['custom-radio']}></span>
                  <span className={s['radio-text']}>오토</span>
                </label>
                <label
                  className={`${s['radio-label']} ${shiftType === '수동' ? s['checked'] : ''}`}
                >
                  <input
                    type="radio"
                    value="수동"
                    checked={shiftType === '수동'}
                    onChange={(e) => setShiftType(e.target.value)}
                    className={s['hidden-radio']}
                  />
                  <span className={s['custom-radio']}></span>
                  <span className={s['radio-text']}>수동</span>
                </label>
              </div>
            </div>

            <div className={`${s['input-wrap']}`}>
              <label>휴대폰 번호</label>
              <div className={s['input-box']}>
                <input
                  placeholder="010-1234-5678"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={13}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={s['button-section']}>
          <span className={s['info-text']}>
            🙅‍♂ 판매 권유 전화가 절대 없어요.
          </span>
          <button className={s['submit-button']}>
            <div className={s['svg-box']}>
              <ButtonCheck width="100%" height="100%" viewBox="0 0 24 24" />
            </div>
            신청 완료
          </button>
        </div>
      </div>
    </div>
    // </div>
  );
}
