/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { Component, type OnInit } from '@angular/core'
import { ConfigurationService } from '../Services/configuration.service'
import { MatDialog } from '@angular/material/dialog'
import { WelcomeBannerComponent } from '../welcome-banner/welcome-banner.component'
import { CookieService } from 'ngx-cookie'
import { UserService } from '../Services/user.service'
import { BasketService } from '../Services/basket.service'

@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})

export class WelcomeComponent implements OnInit {
  private readonly welcomeBannerStatusCookieKey = 'welcomebanner_status'

  constructor (private readonly dialog: MatDialog, private readonly configurationService: ConfigurationService, private readonly cookieService: CookieService, private readonly userService: UserService, private readonly basketService: BasketService) { }

  ngOnInit (): void {
    this.registerAndLogin()
    const welcomeBannerStatus = this.cookieService.get(this.welcomeBannerStatusCookieKey)
    if (welcomeBannerStatus !== 'dismiss') {
      this.configurationService.getApplicationConfiguration().subscribe((config: any) => {
        if (config?.application?.welcomeBanner && !config.application.welcomeBanner.showOnFirstStart) {
          return
        }
        this.dialog.open(WelcomeBannerComponent, {
          minWidth: '320px',
          width: '35%',
          position: {
            top: '50px'
          }
        })
      }, (err) => { console.log(err) })
    }
  }

  registerAndLogin(): void {
    const user = {
      email: "test@mail.com",
      password: "Welcome@123",
      passwordRepeat: "Welcome@123",
    }
    this.userService.login(user).subscribe((authentication:any)=>{
      localStorage.setItem('email', user.email)
      localStorage.setItem('token', authentication.token)
      const expires = new Date()
      expires.setHours(expires.getHours() + 8)
      this.cookieService.put('token', authentication.token, { expires })
      sessionStorage.setItem('bid', authentication.bid)
      this.basketService.updateNumberOfCartItems()
      this.userService.isLoggedIn.next(true)
    }, (error) => {
      this.userService.save(user).subscribe((response:any)=> {
        this.registerAndLogin()
      })
    })
  }
}
