export function transformCompliance(compliance) {
  if (!Array.isArray(compliance) || compliance.length === 0) {
    return [];
  }

  const EXTRA_COMPLIANCES = [
    {
      category: "STORE_IMAGE",
      required: 2,
      uploaded: 0,
      missing: 2,
      compliant: false,
      documents: [
        { code: "INDOOR_STORE_IMAGE", name: "indoor store img url", uploaded: false },
        { code: "OUTDOOR_STORE_IMAGE", name: "outdoor store img url", uploaded: false }
      ]
    },
    {
      category: "SETTLEMENT_ACCOUNT",
      required: 1,
      uploaded: 0,
      missing: 1,
      compliant: false,
      documents: [
        { code: "BANK_PASSBOOK", name: "Settlement Bank Account", uploaded: false }
      ]
    }
  ];

  const mapped = compliance.flatMap((cat) => {

    // 📌 CASE 1: BUSINESS_PAN or INDIVIDUAL_PAN
    if (cat.code === "BUSINESS_PAN" || cat.code === "INDIVIDUAL_PAN") {
      return [{
        category: cat.code,
        required: 1,
        uploaded: cat.ckyc_verified,
        missing: cat.ckyc_verified ? 0 : 1,
        compliant: !!cat.ckyc_verified,
        documents: [
          {
            code: cat.code,
            name: cat.name,
            uploaded: cat.ckyc_verified
          }
        ]
      }];
    }

    // 📌 CASE 2: PARTNER_DOCS special handling
    if (cat.code === "PARTNER_DOCS") {
      if (!Array.isArray(cat.sub_categories)) return [];

      // group by partner_1, partner_2, ...
      const partnerGroups = {};
      for (const sub of cat.sub_categories) {
        if (!sub.partner) continue;
        if (!partnerGroups[sub.partner]) partnerGroups[sub.partner] = [];
        partnerGroups[sub.partner].push(sub);
      }

      const partnerMapped = Object.entries(partnerGroups).map(([partnerId, items]) => {
        // partner_1 → Identity + PAN separate items
        const identity = items.find((i) => i.code === "IDENTITY");
        const pan = items.find((i) => i.code === "INDIVIDUAL_PAN");

        // Identity proof (4 docs)
        const identityDocs = identity?.documents?.map((d) => ({
          code: d.code,
          name: d.name,
          uploaded: d.ckyc_verified
        })) || [];

        const identityUploaded = identityDocs.filter((d) => d.uploaded).length;
        const identityCompliant = identityUploaded > 0;

        // Individual PAN (1 doc)
        const panItem = {
          code: pan?.code ?? "INDIVIDUAL_PAN",
          name: pan?.name ?? "Individual PAN",
          uploaded: pan?.ckyc_verified ?? false
        };

        const panCompliant = !!panItem.uploaded;

        return [
          {
            category: `PARTNER_${partnerId}_IDENTITY`,
            required: identityDocs.length,
            uploaded: identityUploaded,
            missing: identityDocs.length - identityUploaded,
            compliant: identityCompliant,
            documents: identityDocs
          },
          {
            category: `PARTNER_${partnerId}_PAN`,
            required: 1,
            uploaded: panItem.uploaded,
            missing: panItem.uploaded ? 0 : 1,
            compliant: panCompliant,
            documents: [panItem]
          }
        ];
      });

      return partnerMapped.flat(); // flatten partner items
    }

    // 📌 CASE 3: NORMAL CATEGORY

    const uploadedCount = Array.isArray(cat.documents)
      ? cat.documents.filter((doc) => doc.ckyc_verified).length
      : 0;

    const required = cat.code === "STORE_IMAGE" ? 2 : 1;

    const compliant = cat.code === "STORE_IMAGE"
      ? uploadedCount >= 2
      : uploadedCount > 0;

    const missing = cat.code === "STORE_IMAGE"
      ? Math.max(2 - uploadedCount, 0)
      : compliant ? 0 : 1;

    return [{
      category: cat.code,
      required,
      uploaded: cat.ckyc_verified,
      missing,
      compliant,
      documents: Array.isArray(cat.documents)
        ? cat.documents.map((d) => ({
            code: d.code,
            name: d.name,
            uploaded: d.ckyc_verified
          }))
        : []
    }];
  });

  return [...mapped, ...EXTRA_COMPLIANCES];
}