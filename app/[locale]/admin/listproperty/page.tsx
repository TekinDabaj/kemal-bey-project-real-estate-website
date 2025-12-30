import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import PropertyListingForm from '@/components/admin/PropertyListingForm'

export default async function ListPropertyPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ edit?: string }>
}) {
  const { locale } = await params
  const { edit } = await searchParams
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/${locale}/admin/login`)
  }

  // Check admin access
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', user.email)
    .single()

  if (!adminUser) {
    redirect(`/${locale}/admin/login`)
  }

  // Get translations
  const t = await getTranslations('admin.listProperty')

  // If editing, fetch the property
  let property = null
  if (edit) {
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('id', edit)
      .single()
    property = data
  }

  // Build translations object
  const translations = {
    pageTitle: t('pageTitle'),
    editPageTitle: t('editPageTitle'),
    backToProperties: t('backToProperties'),
    sections: {
      basicInfo: t('sections.basicInfo'),
      location: t('sections.location'),
      media: t('sections.media'),
      specifications: t('sections.specifications'),
      rooms: t('sections.rooms'),
      amenities: t('sections.amenities')
    },
    fields: {
      title: t('fields.title'),
      titlePlaceholder: t('fields.titlePlaceholder'),
      description: t('fields.description'),
      descriptionPlaceholder: t('fields.descriptionPlaceholder'),
      price: t('fields.price'),
      pricePlaceholder: t('fields.pricePlaceholder'),
      currency: t('fields.currency'),
      type: t('fields.type'),
      forSale: t('fields.forSale'),
      forRent: t('fields.forRent'),
      status: t('fields.status'),
      active: t('fields.active'),
      sold: t('fields.sold'),
      rented: t('fields.rented'),
      inactive: t('fields.inactive'),
      featured: t('fields.featured'),
      featuredHelp: t('fields.featuredHelp')
    },
    location: {
      address: t('location.address'),
      addressPlaceholder: t('location.addressPlaceholder'),
      pinOnMap: t('location.pinOnMap'),
      selectLocation: t('location.selectLocation'),
      coordinates: t('location.coordinates'),
      latitude: t('location.latitude'),
      longitude: t('location.longitude'),
      mapInstructions: t('location.mapInstructions'),
      confirmLocation: t('location.confirmLocation'),
      closeMap: t('location.closeMap')
    },
    media: {
      propertyImages: t('media.propertyImages'),
      propertyImagesHelp: t('media.propertyImagesHelp'),
      floorPlans: t('media.floorPlans'),
      floorPlansHelp: t('media.floorPlansHelp'),
      dragDrop: t('media.dragDrop'),
      maxSize: t('media.maxSize'),
      uploading: t('media.uploading'),
      uploadProgress: t('media.uploadProgress'),
      uploadComplete: t('media.uploadComplete'),
      removeImage: t('media.removeImage'),
      setCover: t('media.setCover'),
      cover: t('media.cover')
    },
    specs: {
      propertyType: t('specs.propertyType'),
      types: {
        apartment: t('specs.types.apartment'),
        house: t('specs.types.house'),
        villa: t('specs.types.villa'),
        penthouse: t('specs.types.penthouse'),
        studio: t('specs.types.studio'),
        duplex: t('specs.types.duplex'),
        townhouse: t('specs.types.townhouse'),
        land: t('specs.types.land'),
        commercial: t('specs.types.commercial'),
        office: t('specs.types.office')
      },
      bedrooms: t('specs.bedrooms'),
      bathrooms: t('specs.bathrooms'),
      totalArea: t('specs.totalArea'),
      yearBuilt: t('specs.yearBuilt'),
      floorNumber: t('specs.floorNumber'),
      totalFloors: t('specs.totalFloors'),
      parkingSpaces: t('specs.parkingSpaces'),
      furnished: t('specs.furnished'),
      furnishedOptions: {
        yes: t('specs.furnishedOptions.yes'),
        no: t('specs.furnishedOptions.no'),
        partial: t('specs.furnishedOptions.partial')
      },
      heatingType: t('specs.heatingType'),
      heatingTypes: {
        central: t('specs.heatingTypes.central'),
        individual: t('specs.heatingTypes.individual'),
        floor: t('specs.heatingTypes.floor'),
        none: t('specs.heatingTypes.none')
      },
      coolingType: t('specs.coolingType'),
      coolingTypes: {
        central: t('specs.coolingTypes.central'),
        split: t('specs.coolingTypes.split'),
        none: t('specs.coolingTypes.none')
      }
    },
    rooms: {
      title: t('rooms.title'),
      help: t('rooms.help'),
      addRoom: t('rooms.addRoom'),
      roomName: t('rooms.roomName'),
      roomArea: t('rooms.roomArea'),
      removeRoom: t('rooms.removeRoom'),
      commonRooms: {
        livingRoom: t('rooms.commonRooms.livingRoom'),
        bedroom: t('rooms.commonRooms.bedroom'),
        kitchen: t('rooms.commonRooms.kitchen'),
        bathroom: t('rooms.commonRooms.bathroom'),
        balcony: t('rooms.commonRooms.balcony'),
        terrace: t('rooms.commonRooms.terrace'),
        garage: t('rooms.commonRooms.garage'),
        storage: t('rooms.commonRooms.storage'),
        office: t('rooms.commonRooms.office'),
        diningRoom: t('rooms.commonRooms.diningRoom')
      }
    },
    amenities: {
      title: t('amenities.title'),
      help: t('amenities.help'),
      pool: t('amenities.pool'),
      gym: t('amenities.gym'),
      sauna: t('amenities.sauna'),
      garden: t('amenities.garden'),
      elevator: t('amenities.elevator'),
      security: t('amenities.security'),
      concierge: t('amenities.concierge'),
      parking: t('amenities.parking'),
      balcony: t('amenities.balcony'),
      terrace: t('amenities.terrace'),
      fireplace: t('amenities.fireplace'),
      airConditioning: t('amenities.airConditioning'),
      heating: t('amenities.heating'),
      laundry: t('amenities.laundry'),
      storage: t('amenities.storage'),
      petFriendly: t('amenities.petFriendly'),
      seaView: t('amenities.seaView'),
      cityView: t('amenities.cityView'),
      mountainView: t('amenities.mountainView'),
      smartHome: t('amenities.smartHome'),
      solarPanels: t('amenities.solarPanels'),
      generator: t('amenities.generator')
    },
    actions: {
      saveDraft: t('actions.saveDraft'),
      publish: t('actions.publish'),
      update: t('actions.update'),
      saving: t('actions.saving'),
      publishing: t('actions.publishing')
    },
    validation: {
      titleRequired: t('validation.titleRequired'),
      priceRequired: t('validation.priceRequired'),
      descriptionRequired: t('validation.descriptionRequired'),
      locationRequired: t('validation.locationRequired'),
      typeRequired: t('validation.typeRequired'),
      imagesRequired: t('validation.imagesRequired')
    },
    success: {
      created: t('success.created'),
      updated: t('success.updated')
    },
    error: {
      createFailed: t('error.createFailed'),
      updateFailed: t('error.updateFailed'),
      uploadFailed: t('error.uploadFailed')
    }
  }

  return <PropertyListingForm property={property} t={translations} />
}
