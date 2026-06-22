'use client';

import React from 'react';
import s from './Section_01.module.scss';
import Image from 'next/image';
import Link from 'next/link';

import SectionImage from '/public/img/sell/main_typo.png';
import SectionButtonImage01 from '/public/img/sell/google-play.png';
import SectionButtonImage02 from '/public/img/sell/appstore.png';

export default function Section_01() {
  return (
    <div className={s['section-container']}>
      <div className={s['section-wrap']}>
        <div className={s['video-container']}>
          <video
            src="/video/sell/desktop_section1_bg.mp4"
            autoPlay
            muted
            loop
            playsInline
            className={s['video-element']}
          />
        </div>

        <div className={s['content-container']}>
          <div className={s['content-wrap']}>
            <div className={`${s['img-wrap']} img-wrap`}>
              <Image src={SectionImage} alt={`sell`} fill sizes="50vw" />
            </div>

            <div className={s['button-wrap']}>
              <Link
                href="https://applink.heydealer.com/QbFw/HomepagePcAndroid"
                className={s['store-link']}
                target={'_blank'}
              >
                <button className={s['store-button']}>
                  <div className={`${s['button-img-wrap']} img-wrap`}>
                    <Image
                      src={SectionButtonImage01}
                      alt={`sell`}
                      fill
                      sizes="50vw"
                    />
                  </div>
                </button>
              </Link>

              <Link
                href="https://applink.heydealer.com/QbFw/HomepagePCiOS"
                className={s['store-link']}
                target={'_blank'}
              >
                <button className={s['store-button']}>
                  <div className={`${s['button-img-wrap']} img-wrap`}>
                    <Image
                      src={SectionButtonImage02}
                      alt={`sell`}
                      fill
                      sizes="50vw"
                    />
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
