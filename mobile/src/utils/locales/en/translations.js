export default {
    home:{
        title:"Home",
        initialMessage:"Take care",
        whereAreYouGoing:"Where are you going ?",
        defineAHomeAddress:"Define a home address",
        defineAProfessionalAddress:"Define a professional address"
    },
    login:{
        loginWithGoogle:"Login with Google",
        loginWithFacebook:"Login with Facebook",
        accountCreation:{
            title:"Account creation",
            subTitle:"Verify that each field holds the correct information",
            email:"Email",
            firstname:"Firstname",
            lastname:"Lastname",
            phone:"Phone",
            createAccount:"Create your account",
            givenNameErrorMessage:"Firstname can not be empty.",
            familyNameErrorMessage:"Lastname can not be empty.",
            phoneErrorMessage:"Incorrect phone number"
        },
        accountConfirmation:{
            title:"Phone validation",
            subTitle:"We just sent a text message with a code to validate your phone number.",
            code:"Code",
            codeErrorMessage: "Wrong code",
            accountWaitingCreation:"Account creation ..."
        }
    },
    driver:{
        drawer:{
            hi:"Hi",
            stopDriving:"Stop driving",
            newDriver:"New driver"
        },
        home:{
            title:"Home",
            initialMessage:"Drive carefully",
            surcharge:"Surcharge",
            request:"Request",
            requestLevel:{
                high:"High",
                low:"Low",
                medium:"Medium"
            },
            estimatedWait:"Estimated wait",
            online:"Online",
            offline:"Offline",
            overlay:{
                title:"Drive request from",
                price:"Price",
                acceptRide:"Accept ride",
                cancelRide:"Refuse ride"
            },
            pickUp:"Pick up ",
            at:"at",
            openIn:"Go with ",
            confirmPick:"has been picked up",
            dropped:"Drop at",
            confirmDrop:"has been dropped",
            rateUser:"Please rate "
        },
        stats:{
            title:"Stats"
        },
        history:{
            title:"History"
        },
    },
    userDrawer:{
        hi:"Hello",
        history:"History",
        settings:"Settings",
        wallet:"Wallet",
        help:"Help",
        newUser:"New user",
        startDriving:"Start driving",
        becomeADriver:"Become a driver"
    },
    order:{
        time:"Time",
        distance:"Distance",
        destination:{
            from:"From",
            to:"To",
            myPosition:"My position",
            placeOfDeparture: "Place of departure",
            whereAreYouGoing: "Where are you going ?"
        },
        confirmation:{
            paymentMethod:"Payment Method",
            pay:"Order",
            cashBack:"Cash-Back",
            selectCard:"Select a payment method"
        },
        waiting:{
            lookingForADriver:"Looking for a driver",
            driverRefused:"The previous driver canceled.",
            newDriver:"New driver",
            noDriver: "No driver available. Please try again later"
        },
        drive:{
            youArrive:"You arrive in ",
            remainingDistance:"Remaining distance ",
            isDrivingYou:" is driving you"
        }
    },
    history:{
        title:"History",
        noDriveHistory :"We did not find any drive in your history",
        from:"From",
        to:"To",
    },
    settings:{
        title:"Settings",
        logOut:"Log out",
        address:{
            homeAddress:"Home address",
            professional:"Professional address",
            address:"Address"
        },
        confidentiality:{
            title:"Confidentiality",
            granted:"Activated",
            notifications:"Notifications",
            position:"Position",
            notgranted:"Desactivated"
        },
        modifyYourAccount:{
            title:"Modify your account",
            favorites:"Favorites",
            home:"Home",
            professional:"Professional",
            defineAHomeAddress:"Define a home address",
            defineAProfessionalAddress:"Define a professional address",
            yourAccount:"Your account",
            firstname:"Firstname",
            lastname:"Lastname",
            phone:"Phone",
            email:"Email",
            verified:"Verified",
            supportRequest: "Impossible to modify this data on your own. Please fill a request to the support."
        },
        emailValidation:{
            titleValidation:"Email validation",
            subTitleValidation:"Click on the link we just sent you to",
            waitingConfirmation:"Waiting for your confirmation",
            emailErrorMessage:"Please enter your email correctly",
            title:"Modify your email",
            email:"Email",
            sendAVerificationEmail:"Send a verification email",
        },
        phoneValidation:{
            titleValidation:"Phone validation",
            subTitleValidation:"We just sent a text message with a code to validate your phone number.",
            waitingConfirmation:"Waiting for your confirmation",
            phoneErrorMessage:"Please enter your phone number correctly",
            title:"Modify your phone",
            phone:"Phone",
            codeErrorMessage:"Wrong code",
            phoneCode:"Code"
        }
    },
    wallet:{
        title:"Wallet",
        BECToken:"BEC Token",
        paymentMethods:"Payment methods",
        addAPaymentMethod:"Add a payment method",
        discounts:"Discounts",
        addADiscount:"Add a discount",
        addPublicKey:"Add your ERC-20 Wallet address",
        publicKey:"Your ERC-20 wallet",
        walletAddressText:"Please verify carefully your ERC-20 wallet address before adding it. We advice you to copy/paste it, in order to avoid any error. In case of an error in the address, the transfered funds will not be recovered.",
        walletAddress:"ERC-20 address",
        walletAddressConfigured:"ERC-20 Wallet address configured",
        walletSupport:"Contact the support to update it",
        addACard:"Add a card",
        card:"Card",
        cardNumber:"Card number",
        yourCard:"Your card",
        expire:"Expire"
    },
    help:{
        title:"Help",
        yourLastDrive:"Your last drive",
        support:"Support",
        lastUpdate:"Last update",
        lastRequest:"Your messages",
        yourMessage:"Your message",
        ticketMessage:"Please provide us with the most information so we can help you in the better way. Never transmit any private information through this service.",
        problemsLinkedToDrives:{
            title:"Problems during a drive"
        },
        accountAndPayment:{
            title:"Account and payment methods"
        },
        guideCashBackAndBec:{
            title:"Cash-Back and BEC token guide"
        },
        more:{
            title:"More"
        },
        supportResponse:{
            title:"The support has responded to your last request",
            altTitle: "See your current support request"
        }
    },
    utils:{
        confirm:"Confirm",
        cancel:"Cancel",
        send:"Send",
        delete:"Delete",
        days:[
            {name:"Monday"},
            {name:"Tuesday"},
            {name:"Wednesday"},
            {name:"Thursday"},
            {name:"Friday"},
            {name:"Saturday"},
            {name:"Sunday"},
        ],
        months:[
            {name:"January"},
            {name:"February"},
            {name:"March"},
            {name:"April"},
            {name:"May"},
            {name:"June"},
            {name:"July"},
            {name:"August"},
            {name:"September"},
            {name:"October"},
            {name:"November"},
            {name:"December"},
        ]
    }
};
